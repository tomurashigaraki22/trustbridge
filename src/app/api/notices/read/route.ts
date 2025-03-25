import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function PATCH(req: Request) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get('authorization');
        const { noticeIds } = await req.json();
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!Array.isArray(noticeIds) || noticeIds.length === 0) {
            return NextResponse.json(
                { error: 'Invalid notice IDs provided' },
                { status: 400 }
            );
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        await pool.query(
            `UPDATE account_notices 
             SET is_read = true 
             WHERE id IN (?) AND user_id = ?`,
            [noticeIds, decoded.userId]
        );

        return NextResponse.json({ 
            message: 'Notices marked as read',
            updatedIds: noticeIds
        });
    } catch (error) {
        console.error('Error updating notices:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}