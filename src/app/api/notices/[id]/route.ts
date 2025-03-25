import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

// Mark notice as read
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        await pool.query(
            `UPDATE account_notices 
             SET is_read = true 
             WHERE id = ? AND user_id = ?`,
            [params.id, decoded.userId]
        );

        return NextResponse.json({ message: 'Notice marked as read' });
    } catch (error) {
        console.error('Error updating notice:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Delete notice
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        await pool.query(
            `DELETE FROM account_notices 
             WHERE id = ? AND user_id = ?`,
            [params.id, decoded.userId]
        );

        return NextResponse.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        console.error('Error deleting notice:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}