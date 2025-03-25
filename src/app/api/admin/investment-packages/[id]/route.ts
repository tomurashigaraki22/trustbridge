import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: Request, { params }: { params: { id: string } }) {
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
            const [packages] = await connection.query(
                'SELECT * FROM investment_packages WHERE id = ?',
                [params.id]
            );

            const package_data = Array.isArray(packages) ? packages[0] : null;

            if (!package_data) {
                return NextResponse.json({ error: "Package not found" }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                package: package_data
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to fetch investment package:", error);
        return NextResponse.json(
            { error: "Failed to fetch investment package" },
            { status: 500 }
        );
    }
}