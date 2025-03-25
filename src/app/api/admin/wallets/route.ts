import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        console.log(req)
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
            const [wallets] = await connection.query(`
                SELECT 
                  *
                FROM wallet_addresses 
                ORDER BY created_at DESC
            `);

            return NextResponse.json({
                success: true,
                wallets
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to fetch wallets:", error);
        return NextResponse.json(
            { error: "Failed to fetch wallets" },
            { status: 500 }
        );
    }
}