import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
import jwt from "jsonwebtoken"
import { RowDataPacket } from 'mysql2'

interface TradingSession extends RowDataPacket {
    id: number;
    bot_id: number;
    bot_name: string;
    description: string;
    min_roi: number;
    max_roi: number;
    duration_days: number;
    initial_amount: number;
    currency: string;
    start_date: Date;
    end_date: Date;
    status: string;
    trading_data_url: string;
    created_at: Date;
    bot_status: string;
    price_amount: number;
    price_currency: string;
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log(req)
        const headersList = headers()
        const authHeader = (await headersList).get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, is_admin: boolean }

        if (!decoded.is_admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const userId = params.id

        const connection = await pool.getConnection()
        try {
            const [sessions] = await connection.query<TradingSession[]>(`
                SELECT 
                    s.*,
                    b.name as bot_name,
                    b.description,
                    b.min_roi,
                    b.max_roi,
                    b.duration_days,
                    b.price_amount,
                    b.price_currency,
                    b.status as bot_status
                FROM user_trading_sessions s
                JOIN trading_bots b ON s.bot_id = b.id
                WHERE s.user_id = ?
                ORDER BY s.start_date DESC`,
                [userId]
            );
            return NextResponse.json({
                success: true,
                sessions: sessions.map((session) => ({
                    id: session.id,
                    bot_id: session.bot_id,
                    bot_name: session.bot_name,
                    description: session.description,
                    min_roi: session.min_roi,
                    max_roi: session.max_roi,
                    duration_days: session.duration_days,
                    initial_amount: session.initial_amount,
                    currency: session.currency,
                    start_date: session.start_date,
                    end_date: session.end_date,
                    status: session.status,
                    trading_data_url: session.trading_data_url,
                    created_at: session.created_at
                }))
            })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to fetch user's trading sessions:", error)
        return NextResponse.json(
            { error: "Failed to fetch user's trading sessions" },
            { status: 500 }
        )
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = headers()
        const authHeader = (await headersList).get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, is_admin: boolean }

        if (!decoded.is_admin) {
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

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = headers()
        const authHeader = (await headersList).get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, is_admin: boolean }

        if (!decoded.is_admin) {
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