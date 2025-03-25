import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { RowDataPacket } from 'mysql2'

interface UserPassword extends RowDataPacket {
    password: string;
}

export async function PUT(req: Request) {
    try {
        const headersList = headers()
        const authHeader = (await headersList).get("authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
        
        const { current_password, new_password } = await req.json()

        const connection = await pool.getConnection()
        try {
            // Get current user's password
            const [users] = await connection.query<UserPassword[]>(
                'SELECT password FROM users WHERE id = ?',
                [decoded.userId]
            )

            if (users.length === 0) {
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            }

            // Verify current password
            const isValid = await bcrypt.compare(current_password, users[0].password)
            if (!isValid) {
                return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(new_password, 10)

            // Update password
            await connection.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, decoded.userId]
            )

            return NextResponse.json({ success: true })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to update password:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update password" },
            { status: 500 }
        )
    }
}