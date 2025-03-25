import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { ResultSetHeader } from 'mysql2';

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
            const [packages] = await connection.query(`
                SELECT 
                    ip.id,
                    ip.name,
                    ip.description,
                    ip.duration_days,
                    ip.min_roi,
                    ip.max_roi,
                    ip.risk_level,
                    ip.features,
                    ip.min_amount_usd,
                    ip.max_amount_usd,
                    ip.is_active,
                    ip.created_at,
                    COUNT(ui.id) as active_investments
                FROM investment_packages ip
                LEFT JOIN user_investments ui ON ip.id = ui.package_id AND ui.status = 'active'
                GROUP BY ip.id
                ORDER BY ip.created_at DESC
            `);

            return NextResponse.json({
                success: true,
                packages
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to fetch investment packages:", error);
        return NextResponse.json(
            { error: "Failed to fetch investment packages" },
            { status: 500 }
        );
    }
}

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

        const { name, description, is_active, duration_days, min_roi, max_roi, risk_level, features, min_amount_usd, max_amount_usd, } = await req.json();

        const connection = await pool.getConnection();
        // Update POST query
        try {
            const [result] = await connection.query<ResultSetHeader>(
                'INSERT INTO investment_packages (name, description, duration_days, min_roi, max_roi, risk_level, features, min_amount_usd, max_amount_usd, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [name, description, duration_days, min_roi, max_roi, risk_level, features, min_amount_usd, max_amount_usd, is_active]
            );
            return NextResponse.json({
                success: true,
                package_id: result.insertId
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to create investment package:", error);
        return NextResponse.json(
            { error: "Failed to create investment package" },
            { status: 500 }
        );
    }
}

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

        const { id, name, description, duration_days, min_roi, max_roi, risk_level, features, min_amount_usd, max_amount_usd, is_active } = await req.json();

        const connection = await pool.getConnection();
        // Update PATCH query
        try {
            await connection.query(
                'UPDATE investment_packages SET name = ?, description = ?, duration_days = ?, min_roi = ?, max_roi = ?, risk_level = ?, features = ?, min_amount_usd = ?, max_amount_usd = ?, is_active = ? WHERE id = ?',
                [name, description, duration_days, min_roi, max_roi, risk_level, features, min_amount_usd, max_amount_usd, is_active, id]
            );

            return NextResponse.json({ success: true });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to update investment package:", error);
        return NextResponse.json(
            { error: "Failed to update investment package" },
            { status: 500 }
        );
    }
}