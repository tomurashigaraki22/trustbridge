import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const { currency, address, amount } = await req.json();

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Create pending transaction record
            const [result] = await connection.query<ResultSetHeader>(
                `INSERT INTO transactions 
                (id, user_id, type, currency, status, amount, to_address, description) 
                VALUES (?, ?, 'deposit', ?, 'pending', ?, ?, ?)`,
                [
                    crypto.randomUUID(),
                    decoded.userId,
                    currency,
                    amount,
                    address,
                    `${currency} deposit to wallet`
                ]
            );


            await connection.query(
                `INSERT INTO account_notices 
                (user_id, type, title, message) 
                VALUES (?, 'transaction', ?, ?)`,
                [
                    decoded.userId,
                    'Deposit Pending',
                    `Your ${currency} deposit is pending and awaiting confirmation`
                ]
            );


            await connection.commit();

            return NextResponse.json({
                success: true,
                message: 'Deposit transaction created',
                transactionId: result.insertId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Deposit creation failed:', error);
        return NextResponse.json(
            { error: 'Failed to create deposit' },
            { status: 500 }
        );
    }
}