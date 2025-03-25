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
            const [accountInfos] = await connection.query(`
                SELECT 
                    ai.*,
                    u.username,
                    u.email
                FROM account_info ai
                JOIN users u ON ai.user_id = u.id
                ORDER BY ai.created_at DESC
            `);

            return NextResponse.json({
                success: true,
                accountInfos
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to fetch account infos:", error);
        return NextResponse.json(
            { error: "Failed to fetch account infos" },
            { status: 500 }
        );
    }
}