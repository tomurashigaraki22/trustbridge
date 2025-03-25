import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface SenderInfo extends RowDataPacket {
    username: string;
    balance: string;
}

interface RecipientInfo extends RowDataPacket {
    id: number;
    username: string;
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
        const { recipientTag, amount, currency, mainAmount } = await req.json();



        // Find recipient
        const [recipient] = await pool.query<RecipientInfo[]>(
            'SELECT id, username FROM users WHERE username = ?',
            [recipientTag]
        );

        if (!recipient.length) {
            return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {

            // Create sender's transaction record
            // Get sender's username and check balance (add this back)
            const [sender] = await pool.query<SenderInfo[]>(
                `SELECT username, ${currency.toLowerCase()}_balance as balance FROM users WHERE id = ?`,
                [decoded.userId]
            );

            if (!sender.length || parseFloat(sender[0].balance) < parseFloat(amount)) {
                return NextResponse.json(
                    { error: 'Insufficient balance for this transaction' },
                    { status: 400 }
                );
            }

            // Update recipient query type
            const [recipient] = await pool.query<RecipientInfo[]>(
                'SELECT id, username FROM users WHERE username = ?',
                [recipientTag]
            );

            // Fix the transaction insert query type
            const [result] = await connection.query<ResultSetHeader>(
                `INSERT INTO transactions 
                (user_id, type, currency, amount, status, to_address, description) 
                VALUES (?, 'p2p', ?, ?, 'completed', ?, ?)`,
                [
                    decoded.userId,
                    currency,
                    mainAmount,
                    recipient[0].id,
                    `Sent ${amount} ${currency} to ${recipientTag}`,
                ]
            );

            // Create recipient's transaction record
            await connection.query(
                `INSERT INTO transactions 
                (user_id, type, currency, amount, status, from_address, description) 
                VALUES (?, 'p2p', ?, ?, 'completed', ?, ?)`,
                [
                    recipient[0].id,
                    currency,
                    mainAmount,
                    decoded.userId,
                    `Received ${amount} ${currency} from ${sender[0].username}`
                ]
            );

            // Update sender's balance
            const balanceColumn = `${currency.toLowerCase()}_balance`;
            await connection.query(
                `UPDATE users 
                SET ${balanceColumn} = ${balanceColumn} - ? 
                WHERE id = ?`,
                [mainAmount, decoded.userId]
            );

            // Update recipient's balance
            await connection.query(
                `UPDATE users 
                SET ${balanceColumn} = ${balanceColumn} + ? 
                WHERE id = ?`,
                [mainAmount, recipient[0].id]
            );

            // Create notice for sender
            await connection.query(
                `INSERT INTO account_notices 
                (user_id, type, title, message) 
                VALUES (?, 'transaction', ?, ?)`,
                [
                    decoded.userId,
                    'P2P Transfer Sent',
                    `Successfully sent ${amount} ${currency} to ${recipientTag}`
                ]
            );

            // Create notice for recipient
            await connection.query(
                `INSERT INTO account_notices 
                (user_id, type, title, message) 
                VALUES (?, 'transaction', ?, ?)`,
                [
                    recipient[0].id,
                    'P2P Transfer Received',
                    `You received ${amount} ${currency} from ${sender[0].username}`
                ]
            );

            await connection.commit();

            return NextResponse.json({
                success: true,
                message: 'P2P transfer completed successfully',
                transactionId: result.insertId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('P2P transfer failed:', error);
        return NextResponse.json(
            { error: 'Transfer failed' },
            { status: 500 }
        );
    }
}