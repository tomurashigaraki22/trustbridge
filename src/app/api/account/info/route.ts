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
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        const connection = await pool.getConnection();
        try {
            const [accountInfos] = await connection.query(
                `SELECT * FROM account_info 
                WHERE user_id = ? 
                ORDER BY created_at DESC`,
                [decoded.userId]
            );

            return NextResponse.json({
                success: true,
                accountInfos
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to fetch account info:", error);
        return NextResponse.json(
            { error: "Failed to fetch account info" },
            { status: 500 }
        );
    }
}