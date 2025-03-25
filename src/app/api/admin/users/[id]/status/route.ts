import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { status } = await req.json();
        
        await pool.query(
            'UPDATE users SET status = ? WHERE id = ?',
            [status, params.id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update user status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update user status' },
            { status: 500 }
        );
    }
}