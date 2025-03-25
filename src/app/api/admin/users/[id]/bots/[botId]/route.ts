import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(
    req: Request,
    { params }: { params: { id: string; botId: string } }
) {
    try {
        const { status, settings } = await req.json();
        
        if (status) {
            await pool.query(
                'UPDATE trading_bots SET status = ? WHERE id = ? AND user_id = ?',
                [status, params.botId, params.id]
            );
        }

        if (settings) {
            await pool.query(
                'UPDATE trading_bots SET settings = ? WHERE id = ? AND user_id = ?',
                [JSON.stringify(settings), params.botId, params.id]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update bot:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update bot' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string; botId: string } }
) {
    try {
        await pool.query(
            'DELETE FROM trading_bots WHERE id = ? AND user_id = ?',
            [params.botId, params.id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete bot:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete bot' },
            { status: 500 }
        );
    }
}