import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

interface Transaction extends RowDataPacket {
    id: number;
    type: string;
    currency: string;
    amount: string;
    status: string;
    created_at: Date;
    to_address?: string;
    from_address?: string;
    description: string;
}

export async function POST(req: Request) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const { startDate, endDate } = await req.json();

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Fetch transactions for the statement
            const [transactions] = await connection.query<Transaction[]>(
                `SELECT 
                    id,
                    type,
                    currency,
                    amount,
                    status,
                    created_at,
                    to_address,
                    from_address,
                    description
                FROM transactions 
                WHERE user_id = ? 
                AND created_at BETWEEN ? AND ?
                ORDER BY created_at DESC`,
                [decoded.userId, startDate, endDate]
            );

            // Create notice for statement generation
            await connection.query(
                `INSERT INTO account_notices 
                (user_id, type, title, message) 
                VALUES (?, 'system', ?, ?)`,
                [
                    decoded.userId,
                    'Account Statement Generated',
                    `Your account statement for the period ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()} has been generated.`
                ]
            );

            await connection.commit();

            return NextResponse.json({
                success: true,
                statement: {
                    transactions,
                    period: {
                        from: startDate,
                        to: endDate
                    }
                }
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Failed to generate statement:', error);
        return NextResponse.json(
            { error: 'Failed to generate statement' },
            { status: 500 }
        );
    }
}