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
            const [investments] = await connection.query(`
                SELECT 
                    ui.*,
                    u.email as user_email,
                    u.username,
                    ip.name as package_name
                FROM user_investments ui
                JOIN users u ON ui.user_id = u.id
                JOIN investment_packages ip ON ui.package_id = ip.id
                ORDER BY ui.start_date DESC
                LIMIT 100
            `);

            return NextResponse.json({
                success: true,
                investments
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to fetch recent investments:", error);
        return NextResponse.json(
            { error: "Failed to fetch recent investments" },
            { status: 500 }
        );
    }
}