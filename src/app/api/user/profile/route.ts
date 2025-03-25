import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
import jwt from "jsonwebtoken"
import { RowDataPacket } from 'mysql2'

interface UserRow extends RowDataPacket {
    id: number;
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

        const { email, username, first_name, last_name, phone_number, country, profile_image } = await req.json()

        const connection = await pool.getConnection()
        try {
            // Check if email is already taken by another user
            const [existingUser] = await connection.query<UserRow[]>(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, decoded.userId]
            )

            if (existingUser.length > 0) {
                return NextResponse.json({ error: "Email already in use" }, { status: 400 })
            }

            // Update user profile
            await connection.query(
                `UPDATE users SET 
                email = ?,
                username = ?,
                first_name = ?,
                last_name = ?,
                phone_number = ?,
                country = ?,
                profile_image = ?
                WHERE id = ?`,
                [email, username, first_name, last_name, phone_number, country, profile_image, decoded.userId]
            )

            return NextResponse.json({ success: true })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to update profile:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update profile" },
            { status: 500 }
        )
    }
}