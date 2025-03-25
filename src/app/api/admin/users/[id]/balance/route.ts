import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { currency, amount } = await req.json();
        
        // Convert currency to database column name
        const columnName = `${currency.toLowerCase()}_balance`;
        
        // Update the specific currency balance
        await pool.query(
            `UPDATE users SET ${columnName} = ? WHERE id = ?`,
            [amount, params.id]
        );

       

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update balance:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update balance' },
            { status: 500 }
        );
    }
}