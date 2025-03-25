import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(req: Request) {
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

        const body = await req.json();
        const { 
            id, 
            name, 
            description, 
            min_roi, 
            max_roi, 
            duration_days, 
            price_amount, 
            price_currency, 
            status 
        } = body;

        const connection = await pool.getConnection();
        try {
            await connection.query(
                `UPDATE trading_bots 
                SET name = ?, 
                    description = ?, 
                    min_roi = ?, 
                    max_roi = ?, 
                    duration_days = ?, 
                    price_amount = ?, 
                    price_currency = ?, 
                    status = ?
                WHERE id = ?`,
                [
                    name,
                    description,
                    min_roi,
                    max_roi,
                    duration_days,
                    price_amount,
                    price_currency,
                    status,
                    id
                ]
            );

            return NextResponse.json({
                success: true,
                message: "Trading bot updated successfully"
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to update trading bot:", error);
        return NextResponse.json(
            { error: "Failed to update trading bot" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get("authorization");
        console.log(req)
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
            const [bots] = await connection.query(`
                SELECT * FROM trading_bots
                ORDER BY created_at DESC
            `);

            return NextResponse.json({
                success: true,
                bots
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to fetch trading bots:", error);
        return NextResponse.json(
            { error: "Failed to fetch trading bots" },
            { status: 500 }
        );
    }
}