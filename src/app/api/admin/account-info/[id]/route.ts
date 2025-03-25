import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(
    request: NextRequest,
    context: { params: { id: string } }
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

        const { title, message, priority } = await request.json();

        const connection = await pool.getConnection();
        try {
            await connection.query(
                `UPDATE account_info 
                SET title = ?, message = ?, priority = ?
                WHERE id = ?`,
                [title, message, priority, context.params.id]
            );

            // Update the notice as well
            await connection.query(
                `UPDATE account_notices 
                SET title = ?, message = ?, type = ?
                WHERE user_id = (
                    SELECT user_id FROM account_info WHERE id = ?
                ) AND title = (
                    SELECT title FROM account_info WHERE id = ?
                )`,
                [title, message, priority === 'urgent' ? 'security' : 'info', context.params.id, context.params.id]
            );

            return NextResponse.json({
                success: true,
                message: "Account information updated successfully"
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to update account info:", error);
        return NextResponse.json(
            { error: "Failed to update account info" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    context: { params: { id: number } }
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
            // Delete from account_notices first
            await connection.query(
                `DELETE FROM account_notices 
                WHERE user_id = (
                    SELECT user_id FROM account_info WHERE id = ?
                ) AND title = (
                    SELECT title FROM account_info WHERE id = ?
                )`,
                [context.params.id, context.params.id]
            );

            // Then delete from account_info
            await connection.query(
                'DELETE FROM account_info WHERE id = ?',
                [context.params.id]
            );

            return NextResponse.json({
                success: true,
                message: "Account information deleted successfully"
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to delete account info:", error);
        return NextResponse.json(
            { error: "Failed to delete account info" },
            { status: 500 }
        );
    }
}