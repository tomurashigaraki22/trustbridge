import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
import jwt from "jsonwebtoken"
import { gzip } from 'zlib'
import { promisify } from 'util'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

// Add these interfaces after imports
interface UserBalance extends RowDataPacket {
    balance: string;
}

interface TradingBot extends RowDataPacket {
    id: number;
    duration_days: number;
    max_roi: number;
    status: string;
}

const gzipAsync = promisify(gzip)

function generateTradingData(initialBalance: number, targetRoi: number, intervals: number) {
    const data = []
    let currentBalance = initialBalance
    const targetBalance = initialBalance * (1 + targetRoi)
    const growthRate = Math.pow(targetBalance / initialBalance, 1 / intervals) - 1

    for (let interval = 0; interval < intervals; interval++) {
        const targetForInterval = initialBalance * Math.pow(1 + growthRate, interval + 1)
        let change = targetForInterval - currentBalance

        // Add randomness
        const fluctuation = change * ((Math.random() * 100 - 50) / 100)
        change += fluctuation

        // Apply loss every 4th interval
        if (interval % 4 === 3) {
            const lossPercentage = (Math.random() * 2 + 1) / 100
            const lossAmount = currentBalance * lossPercentage
            change = -lossAmount
        }

        currentBalance += change
        currentBalance = Math.max(1, currentBalance)

        data.push({
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now() + (interval * 5000), // Adding 5 seconds (5000ms) for each interval
            balance: Number(currentBalance.toFixed(2)),
            change: Number(change.toFixed(2)),
        })
    }

    return data
}

 
export async function POST(req: Request) {
    try {
        const headersList = headers()
        const authHeader = (await headersList).get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
        const { botId, amount, currency } = await req.json()

        // Check if user has sufficient balance
        // Update user balance query
        const [userBalance] = await pool.query<UserBalance[]>(
            `SELECT ${currency.toLowerCase()}_balance as balance FROM users WHERE id = ?`,
            [decoded.userId]
        );

        if (!userBalance.length || parseFloat(userBalance[0].balance) < (parseFloat(amount) + 0.0005)) {
            return NextResponse.json(
                { error: 'Insufficient balance for this transaction' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection()
        try {
            // Get bot details
            // Update bot query
            const [bots] = await pool.query<TradingBot[]>(
                'SELECT * FROM trading_bots WHERE id = ? AND status = "active"',
                [botId]
            );

            if (!bots.length) {
                throw new Error("Bot not found or inactive")
            }

            const bot = bots[0]
            const intervals = bot.duration_days * 17280
            const tradingData = generateTradingData(amount, bot.max_roi / 100, intervals)
            const jsonData = JSON.stringify(tradingData)
            
            // Compress data with gzip
            const compressedData = await gzipAsync(jsonData)
            const fileName = `${decoded.userId}_${botId}_${Date.now()}.gz`

            // Create form data for upload
            const formData = new FormData()
            formData.append('file', new Blob([compressedData], { type: 'application/gzip' }), fileName)

            const uploadResponse = await fetch(process.env.FILE_SERVER_URL!, {
                method: 'POST',
                body: formData
            })

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload file')
            }

            // Start transaction
            await connection.beginTransaction()

            // Update user balance
            const uploadResult = await uploadResponse.json()
            const balanceColumn = `${currency.toLowerCase()}_balance`
            // Update balance update query
            const [balanceResult] = await connection.query<ResultSetHeader>(
                `UPDATE users 
                SET ${balanceColumn} = ${balanceColumn} - ? 
                WHERE id = ?`,
                [amount, decoded.userId]
            );



            const fileUrl = uploadResult.file_url

            // Create trading session
            const endDate = new Date()
            endDate.setDate(endDate.getDate() + bot.duration_days)
            console.log('before adding session')
            // Update session insert query
            const [sessionResult] = await connection.query<ResultSetHeader>(
                `INSERT INTO user_trading_sessions 
                (user_id, bot_id, initial_amount, currency, start_date, end_date, status, trading_data_url)
                VALUES (?, ?, ?, ?, NOW(), ?, 'active', ?)`,
                [decoded.userId, botId, amount, currency, endDate, fileUrl]
            );
            console.log('after adding session')

            // Commit transaction
            await connection.commit()

            return NextResponse.json({ success: true, sessionId: sessionResult.insertId, balanceResult })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to start trading:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to start trading" },
            { status: 500 },
        )
    }
}

