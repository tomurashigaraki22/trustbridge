import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
import jwt from "jsonwebtoken"
import { RowDataPacket } from 'mysql2'

interface TradingBot extends RowDataPacket {
    id: number;
    name: string;
    description: string;
    min_roi: number;
    max_roi: number;
    duration_days: number;
    price_amount: number;
    price_currency: string;
    status: string;
}

interface TradingSession extends RowDataPacket {
    id: number;
    user_id: number;
    bot_id: number;
    initial_amount: number;
    currency: string;
    start_date: Date;
    end_date: Date;
    status: string;
    trading_data_url: string;
    created_at: Date;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const headersList = headers()
        const authHeader = (await headersList).get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        console.log(req)

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, isAdmin: boolean }

        if (!decoded.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const connection = await pool.getConnection()
        try {
            const [bots] = await connection.query<TradingBot[]>(
                `SELECT * FROM trading_bots WHERE id = ?`,
                [params.id]
            );
            
            if (!bots.length) {
                return NextResponse.json({ error: "Bot not found" }, { status: 404 })
            }
            
            const [sessions] = await connection.query<TradingSession[]>(
                `SELECT * FROM user_trading_sessions WHERE bot_id = ? ORDER BY created_at DESC`,
                [params.id]
            );

            return NextResponse.json({
                success: true,
                bot: bots[0],
                sessions
            })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to fetch bot details:", error)
        return NextResponse.json(
            { error: "Failed to fetch bot details" },
            { status: 500 }
        )
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const headersList = headers()
        const authHeader = (await headersList).get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, isAdmin: boolean }

        if (!decoded.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const updates = await req.json()
        const allowedFields = [
            'name', 'description', 'min_roi', 'max_roi',
            'duration_days', 'price_amount', 'price_currency', 'status'
        ]

        const updateFields = Object.keys(updates)
            .filter(key => allowedFields.includes(key))
            .map(key => `${key} = ?`)
            .join(', ')

        const updateValues = Object.keys(updates)
            .filter(key => allowedFields.includes(key))
            .map(key => updates[key])

        if (!updateFields) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
        }

        const connection = await pool.getConnection()
        try {
            await connection.query(
                `UPDATE trading_bots SET ${updateFields} WHERE id = ?`,
                [...updateValues, params.id]
            )

            return NextResponse.json({ success: true })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to update bot:", error)
        return NextResponse.json(
            { error: "Failed to update bot" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const headersList = headers()
        const authHeader = (await headersList).get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, isAdmin: boolean }

        if (!decoded.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const connection = await pool.getConnection()
        try {
            await connection.query(
                'DELETE FROM trading_bots WHERE id = ?',
                [params.id]
            )

            return NextResponse.json({ success: true })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to delete bot:", error)
        return NextResponse.json(
            { error: "Failed to delete bot" },
            { status: 500 }
        )
    }
}