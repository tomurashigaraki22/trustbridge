import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { RowDataPacket } from 'mysql2'

interface PasswordReset extends RowDataPacket {
    user_id: number;
}

export async function POST(req: Request) {
    try {
        const { email, otp, password } = await req.json()

        const connection = await pool.getConnection()
        try {
            // Verify OTP
            const [resets] = await connection.query<PasswordReset[]>(
                `SELECT user_id FROM password_resets 
                 WHERE email = ? AND otp = ? AND expires_at > NOW()
                 AND used = 0`,
                [email, otp]
            )

            if (resets.length === 0) {
                return NextResponse.json(
                    { error: 'Invalid or expired reset code' },
                    { status: 400 }
                )
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Update password
            await connection.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, resets[0].user_id]
            )

            // Mark OTP as used
            await connection.query(
                'UPDATE password_resets SET used = 1 WHERE email = ? AND otp = ?',
                [email, otp]
            )

            return NextResponse.json({ success: true })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error('Password reset error:', error)
        return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500 }
        )
    }
}