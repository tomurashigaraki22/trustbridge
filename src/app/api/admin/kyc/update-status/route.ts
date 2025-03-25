import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        // Verify admin status
        const [adminCheck] = await pool.query(
            'SELECT is_admin FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (!(adminCheck as any[])[0]?.is_admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { documentId, status } = await request.json();

        // Update KYC document status
        await pool.query(
            'UPDATE kyc_documents SET status = ? WHERE id = ?',
            [status, documentId]
        );

        // Update user's KYC status
        await pool.query(
            `UPDATE users u 
             JOIN kyc_documents k ON u.id = k.user_id 
             SET u.kyc_status = ? 
             WHERE k.id = ?`,
            [status, documentId]
        );

        return NextResponse.json({ 
            success: true, 
            message: 'KYC status updated successfully' 
        });

    } catch (error) {
        console.error('Failed to update KYC status:', error);
        return NextResponse.json({ 
            error: 'Failed to update KYC status' 
        }, { status: 500 });
    }
}