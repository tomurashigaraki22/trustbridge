import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { generateRandom9DigitInteger } from '../../../../../../../scripts/generateId';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        // Check if the user is an admin
        const [adminCheck] = await pool.query(
            'SELECT is_admin FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (!adminCheck[0]?.is_admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, currency } = await req.json();
        const userId = parseInt(params.id);

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Create bonus transaction record
            await connection.query(
                `INSERT INTO transactions 
                (user_id, type, currency, amount, status, description) 
                VALUES (?, 'bonus', ?, ?, 'completed', 'Admin Bonus')`,
                [userId, currency, amount]
            );

            // Update user balance
            const balanceColumn = `usdt_balance`;
            await connection.query(
                `UPDATE users 
                SET ${balanceColumn} = ${balanceColumn} + ? 
                WHERE id = ?`,
                [amount, userId]
            );
            const id = generateRandom9DigitInteger()

            // Create notice
            await connection.query(
                `INSERT INTO account_notices 
                (id, user_id, type, title, message) 
                VALUES (?, ?, 'transaction', 'Bonus Received', ?)`,
                [id, userId, `You received a bonus of $${amount}`]
            );

            await connection.commit();

            return NextResponse.json({
                success: true,
                message: 'Bonus added successfully'
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Failed to add bonus:', error);
        return NextResponse.json(
            { error: 'Failed to add bonus' },
            { status: 500 }
        );
    }
}