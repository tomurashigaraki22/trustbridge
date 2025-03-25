import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, is_admin: boolean };

        if (!decoded.is_admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const connection = await pool.getConnection();
        try {
            const [sessions] = await connection.query(`
                SELECT 
                    uts.*,
                    u.email as user_email,
                    u.username,
                    tb.name as bot_name
                FROM user_trading_sessions uts
                JOIN users u ON uts.user_id = u.id
                JOIN trading_bots tb ON uts.bot_id = tb.id
                ORDER BY uts.start_date DESC
                LIMIT 100
            `);

            return NextResponse.json({
                success: true,
                sessions
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to fetch bot sessions:", error);
        return NextResponse.json(
            { error: "Failed to fetch bot sessions" },
            { status: 500 }
        );
    }
}