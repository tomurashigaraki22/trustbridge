import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(
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

        const connection = await pool.getConnection();
        try {
            const [wallets] = await connection.query(
                `SELECT 
                    *
                FROM wallet_addresses 
                WHERE id = ?`,
                [params.id]
            );

            if (!Array.isArray(wallets) || wallets.length === 0) {
                return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                wallet: wallets[0]
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to fetch wallet:", error);
        return NextResponse.json(
            { error: "Failed to fetch wallet" },
            { status: 500 }
        );
    }
}

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
        const { label, currency, address, is_default } = body;

        const connection = await pool.getConnection();
        try {
            // If setting as default, unset other default addresses for this user and currency
            if (is_default) {
                await connection.query(
                    `UPDATE wallet_addresses 
                    SET is_default = false 
                    WHERE user_id = (
                        SELECT user_id FROM wallet_addresses WHERE id = ?
                    ) AND currency = ?`,
                    [params.id, currency]
                );
            }

            await connection.query(
                `UPDATE wallet_addresses 
                SET label = ?,
                    currency = ?,
                    address = ?,
                    is_default = ?
                WHERE id = ?`,
                [label, currency, address, is_default, params.id]
            );

            return NextResponse.json({
                success: true,
                message: "Wallet address updated successfully"
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to update wallet:", error);
        return NextResponse.json(
            { error: "Failed to update wallet" },
            { status: 500 }
        );
    }
}