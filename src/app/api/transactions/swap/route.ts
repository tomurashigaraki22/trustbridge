import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Add these interfaces after imports
interface BalanceResult extends RowDataPacket {
    balance: number;
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
        const { fromAmount, fromCurrency, toCurrency, toAmount, fee, usdAmount } = await req.json();

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Check user's balance
            // Update the balance check query
            const [balanceResult] = await connection.query<BalanceResult[]>(
                `SELECT ${fromCurrency.toLowerCase()}_balance as balance FROM users WHERE id = ?`,
                [decoded.userId]
            );

            if (!balanceResult[0] || Number(balanceResult[0].balance) < Number(fromAmount)) {
                throw new Error('Insufficient balance');
            }

            // Deduct from source currency
            await connection.query(
                `UPDATE users 
                SET ${fromCurrency.toLowerCase()}_balance = ${fromCurrency.toLowerCase()}_balance - ? 
                WHERE id = ?`,
                [fromAmount, decoded.userId]
            );

            // Add to target currency
            await connection.query(
                `UPDATE users 
                SET ${toCurrency.toLowerCase()}_balance = ${toCurrency.toLowerCase()}_balance + ? 
                WHERE id = ?`,
                [toAmount, decoded.userId]
            );

            // Create swap transaction record for outgoing
            // Update the transaction insert query
            const [fromResult] = await connection.query<ResultSetHeader>(
                `INSERT INTO transactions 
                (user_id, type, currency, amount, fee, status, description, created_at, updated_at) 
                VALUES (?, 'swap', ?, ?, ?, 'completed', ?, NOW(), NOW())`,
                [
                    decoded.userId,
                    fromCurrency,
                    usdAmount,
                    fee,
                    `Swapped ${fromAmount} ${fromCurrency} to ${toAmount} ${toCurrency} (${usdAmount} USD)`
                ]
            );

            // Create notification for successful swap

            await connection.query(
                `INSERT INTO account_notices 
                (user_id, type, title, message) 
                VALUES (?, 'transaction', ?, ?)`,
                [
                    decoded.userId,
                    'Swap Successful',
                    `Successfully swapped ${fromAmount} ${fromCurrency} to ${toAmount} ${toCurrency} (${usdAmount} USD)`
                ]
            );


            await connection.commit();

            return NextResponse.json({
                success: true,
                message: 'Swap completed successfully',
                transactionIds: {
                    from: fromResult.insertId,
                }
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Swap failed:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to complete swap' },
            { status: 500 }
        );
    }
}