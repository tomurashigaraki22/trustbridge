import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
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

        const { userId, title, message, priority } = await req.json();

        const connection = await pool.getConnection();
        try {
            // Insert into account_info
            await connection.query(
                `INSERT INTO account_info (
                    user_id,
                    priority,
                    title,
                    message
                ) VALUES (?, ?, ?, ?)`,
                [userId, priority, title, message]
            );

            // Insert into account_notices
            await connection.query(
                `INSERT INTO account_notices (
                    user_id,
                    type,
                    title,
                    message
                ) VALUES (?, ?, ?, ?)`,
                [userId, priority === 'urgent' ? 'security' : 'info', title, message]
            );

            return NextResponse.json({
                success: true,
                message: "Account information sent successfully"
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to send account information:", error);
        return NextResponse.json(
            { error: "Failed to send account information" },
            { status: 500 }
        );
    }
}