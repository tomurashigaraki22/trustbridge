import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const [transactions] = await pool.query(
            `SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC`,
            [params.id]
        );

        return NextResponse.json({
            success: true,
            transactions
        });
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}