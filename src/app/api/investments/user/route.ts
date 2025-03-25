import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {
    try {
        const headersList = headers()
        const authHeader = (await headersList).get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 })
        }
        console.log(req)
        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

        const connection = await pool.getConnection()
        try {
            const [investments] = await connection.query(`
                SELECT 
                    ui.*,
                    ip.name as package_name,
                    ip.duration_days,
                    ip.min_roi,
                    ip.max_roi
                FROM user_investments ui
                JOIN investment_packages ip ON ui.package_id = ip.id
                WHERE ui.user_id = ?
                ORDER BY ui.start_date DESC
            `, [decoded.userId])

            return NextResponse.json({
                success: true,
                investments,
            })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to fetch user investments:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch investments" },
            { status: 500 },
        )
    }
}