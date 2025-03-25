import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface UserData extends RowDataPacket {
    id: number;
    email: string;
    otp_code: string | null;
    otp_status: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { otp } = body;
        
        // Get token from Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        
        // Get user data
        const [users] = await pool.query<UserData[]>(
            'SELECT id, email, otp_code, otp_status FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = users[0];

        if (!user.otp_code || user.otp_code !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // Update user OTP status
        await pool.query(
            'UPDATE users SET otp_status = ?, otp_code = NULL WHERE id = ?',
            ['active', user.id]
        );

        // Generate new JWT token with updated status
        const newToken = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                status: 'active',
                otpStatus: 'active'
            },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return NextResponse.json({ 
            success: true,
            token: newToken
        });

    } catch (error) {
        console.error('OTP verification failed:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }
}