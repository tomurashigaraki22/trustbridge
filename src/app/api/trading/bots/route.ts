import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
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

export async function GET(req: Request) {
    try {
        const headersList = headers()
        const authHeader = (await headersList).get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        console.log(req)
        // const token = authHeader.split(" ")[1]
        // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

        const connection = await pool.getConnection()
        try {
            const [bots] = await connection.query<TradingBot[]>(
                'SELECT * FROM trading_bots WHERE status = "active"'
            )

            return NextResponse.json({
                bots: bots.map((bot) => ({
                    id: bot.id,
                    name: bot.name,
                    description: bot.description,
                    min_roi: bot.min_roi,
                    max_roi: bot.max_roi,
                    duration_days: bot.duration_days,
                    price_amount: bot.price_amount,
                    price_currency: bot.price_currency
                }))
            })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to fetch bots:", error)
        return NextResponse.json(
            { error: "Failed to fetch trading bots" },
            { status: 500 }
        )
    }
}