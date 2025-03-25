import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const body = await request.json();
        const { status } = body;

        if (!['active', 'completed', 'failed'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const connection = await pool.getConnection();
        try {
            await connection.query(
                `UPDATE user_trading_sessions 
                SET status = ?,
                    end_date = ${status === 'completed' || status === 'cancelled' ? 'NOW()' : 'NULL'}
                WHERE id = ?`,
                [status, params.id]
            );

            return NextResponse.json({
                success: true,
                message: "Session status updated successfully"
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to update session status:", error);
        return NextResponse.json(
            { error: "Failed to update session status" },
            { status: 500 }
        );
    }
}