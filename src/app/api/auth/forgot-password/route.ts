import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import nodemailer from 'nodemailer'
import { RowDataPacket } from 'mysql2'

interface User extends RowDataPacket {
    id: number;
}

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiryTime = new Date(Date.now() + 30 * 60000) // 30 minutes from now

        const connection = await pool.getConnection()
        try {
            // Check if user exists
            // Check if user exists with proper typing
            const [users] = await connection.query<User[]>(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                // Return success even if user doesn't exist for security
                return NextResponse.json({ success: true })
            }

            // Store OTP in database
            await connection.query(
                `INSERT INTO password_resets (user_id, email, otp, expires_at) 
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                 otp = VALUES(otp),
                 expires_at = VALUES(expires_at)`,
                [users[0].id, email, otp, expiryTime]
            )

            // Send email
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            })

            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'Password Reset Code',
                html: `
                    <h1>Password Reset</h1>
                    <p>Your password reset code is: <strong>${otp}</strong></p>
                    <p>This code will expire in 30 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                `,
            })

            return NextResponse.json({ success: true })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error('Password reset request error:', error)
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
}