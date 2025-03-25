import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
import jwt from "jsonwebtoken"
import { gunzip } from 'zlib'
import { promisify } from 'util'
import { RowDataPacket } from 'mysql2'

interface TradingSession extends RowDataPacket {
    id: number;
    user_id: number;
    bot_id: number;
    initial_amount: number;
    currency: string;
    status: string;
    trading_data_url: string;
    current_profit: number;
    bot_name?: string;
    bot_description?: string;
}

const gunzipAsync = promisify(gunzip)

export async function POST(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const sessionId = params.id
    const headersList = headers()
    const authHeader = (await headersList).get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

    const connection = await pool.getConnection()
    try {
      // Fetch the session and trading data
      // Update POST query
      const [sessions] = await connection.query<TradingSession[]>(
          `SELECT * FROM user_trading_sessions WHERE id = ? AND user_id = ?`,
          [sessionId, decoded.userId]
      );

      if (!sessions.length) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }

      const session = sessions[0]
      const response = await fetch(session.trading_data_url)
      const compressedData = await response.arrayBuffer()
      const decompressedData = await gunzipAsync(Buffer.from(compressedData))
      const tradingData = JSON.parse(decompressedData.toString())

      const lastEntry = tradingData[tradingData.length - 1]

      // Calculate final amount with profit
      const finalAmount = (lastEntry.balance)
      const percentage = ((lastEntry.balance - session.initial_amount) / session.initial_amount) * 100;

      // Update user's balance
      const balanceColumn = `${session.currency.toLowerCase()}_balance`
      await connection.query(
        `UPDATE users 
        SET ${balanceColumn} = ${balanceColumn} + ? 
        WHERE id = ?`,
        [finalAmount, decoded.userId]
      )

      // Update session status
      await connection.query(
        `UPDATE user_trading_sessions SET status = 'completed', current_profit = ? WHERE id = ?`,
        [percentage, sessionId]
      )

      // Create notification
      await connection.query(
        `INSERT INTO account_notices 
        (user_id, type, title, message) 
        VALUES (?, 'transaction', ?, ?)`,
        [
          decoded.userId,
          'Trading Bot Closed',
          `Trading session closed with ${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}% profit (${session.currency} ${finalAmount.toFixed(2)})`
        ]
      )

      return NextResponse.json({
        success: true,
        finalProfit: percentage,
        finalAmount: finalAmount
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Failed to close session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to close session" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const sessionId = (params.id)
    // console.log(sessionId)
    // if (isNaN(sessionId)) {
    //   return NextResponse.json({ error: "Invalid session ID" }, { status: 400 })
    // }
    const headersList = headers()
    const authHeader = (await headersList).get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

    const connection = await pool.getConnection()
    try {
      // Update GET query
      const [sessions] = await connection.query<TradingSession[]>(
          `SELECT 
              uts.*,
              tb.name as bot_name,
              tb.description as bot_description
          FROM user_trading_sessions uts
          JOIN trading_bots tb ON uts.bot_id = tb.id
          WHERE uts.id = ? AND uts.user_id = ?`,
          [sessionId, decoded.userId]
      );

      if (!sessions.length) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }

      const session = sessions[0]

      // Fetch gzipped data
      const response = await fetch(session.trading_data_url)
      if (!response.ok) {
        throw new Error("Failed to fetch trading data")
      }

      const compressedData = await response.arrayBuffer()
      const decompressedData = await gunzipAsync(Buffer.from(compressedData))
      const tradingData = JSON.parse(decompressedData.toString())

      return NextResponse.json({
        session: {
          ...session,
          trading_data: tradingData
        }
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Failed to fetch session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch session" },
      { status: 500 }
    )
  }
}

