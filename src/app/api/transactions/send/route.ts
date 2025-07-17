import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { generateRandom9DigitInteger } from '../../../../../scripts/generateId';

interface UserBalance extends RowDataPacket {
    balance: string;
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
        const { amount, currency, address, withdrawalType } = await req.json();

        // Generate appropriate description based on withdrawal type
        const getTransactionDetails = (type: string, address: string) => {
            switch (type) {
                case 'bank':
                    const bankDetails = JSON.parse(address);
                    return {
                        type: 'withdrawal',
                        description: `Bank Transfer - ${bankDetails.bankName} - Acc: ${bankDetails.accountNumber}`,
                        displayAddress: `${bankDetails.bankName} - ${bankDetails.accountName}`
                    };
                case 'paypal':
                    return {
                        type: 'withdrawal',
                        description: `PayPal Transfer to ${address}`,
                        displayAddress: address
                    };
                case 'cashapp':
                    return {
                        type: 'withdrawal',
                        description: `Cash App Transfer to ${address}`,
                        displayAddress: address
                    };
                case 'zelle':
                    return {
                        type: 'withdrawal',
                        description: `Zelle Transfer to ${address}`,
                        displayAddress: address
                    };
                default:
                    return {
                        type: 'transfer',
                        description: `Crypto Transfer to ${address}`,
                        displayAddress: address
                    };
            }
        };

        const txDetails = getTransactionDetails(withdrawalType, address);

        // Check gas fee configuration
        const isFixedGas = process.env.NEXT_PUBLIC_FIXED_GAS === 'true';
        const fixedGasAmount = parseFloat(process.env.NEXT_PUBLIC_FIXED_GAS_AMOUNT || '0');
        const conversionRate = parseFloat(process.env.NEXT_PUBLIC_CONVERSION?.replace(',', '') || '0');
        const gasFee = parseFloat(amount) * 0.01;
        const gasCurrency = process.env.NEXT_PUBLIC_GASFEE_CURRENCY || currency;

        console.log('gasFee:', gasFee, 'gasCurrency:', gasCurrency, 'conversionRate:', conversionRate, 'isFixedGas:', isFixedGas, 'fixedGasAmount:', fixedGasAmount, 'currency:', currency)

        // Check transaction amount balance
        const [userBalance] = await pool.query<UserBalance[]>(
            `SELECT ${currency.toLowerCase()}_balance as balance FROM users WHERE id = ?`,
            [decoded.userId]
        );

        console.error(userBalance)

        if (!userBalance.length || parseFloat(userBalance[0].balance) < parseFloat(amount)) {
            return NextResponse.json(
                { error: 'Insufficient balance for transaction amount' },
                { status: 400 }
            );
        }
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        // If using fixed gas, check gas fee balance
        if (isFixedGas) {
            const [gasBalance] = await pool.query<UserBalance[]>(
                `SELECT ${gasCurrency.toLowerCase()}_balance as balance FROM users WHERE id = ?`,
                [decoded.userId]
            );

            const requiredGasInETH = gasFee / conversionRate;
            const requiredGasInUSD = gasFee;



            if (!gasBalance.length || parseFloat(gasBalance[0].balance) < requiredGasInUSD) {
                return NextResponse.json(
                    { error: `Insufficient ${gasCurrency} balance for gas fee. Required: ${requiredGasInETH} ${gasCurrency} (≈$${requiredGasInUSD.toFixed(2)})` },
                    { status: 400 }
                );
            }


            const balanceColumn = `${gasCurrency.toLowerCase()}_balance`;
            await connection.query(
                `UPDATE users 
                SET ${balanceColumn} = ${balanceColumn} - ? 
                WHERE id = ?`,
                [gasFee, decoded.userId]
            );

        }

        // Start transaction

        try {
            // Create transaction record with updated type and description
            const [result] = await connection.query<ResultSetHeader>(
                `INSERT INTO transactions 
                (user_id, type, currency, amount, fee, status, to_address, description) 
                VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
                [
                    decoded.userId,
                    txDetails.type,
                    currency,
                    amount,
                    '0.0005',
                    txDetails.displayAddress,
                    txDetails.description
                ]
            );

            // Update user balance
            const balanceColumn = `${currency.toLowerCase()}_balance`;
            await connection.query(
                `UPDATE users 
                SET ${balanceColumn} = ${balanceColumn} - ? 
                WHERE id = ?`,
                [amount, decoded.userId]
            );

            // Create notice with appropriate message
            const id = generateRandom9DigitInteger()
            await connection.query(
                `INSERT INTO account_notices 
                (id, user_id, type, title, message) 
                VALUES (?, ?, 'transaction', ?, ?)`,
                [
                    id,
                    decoded.userId,
                    `${txDetails.type.charAt(0).toUpperCase() + txDetails.type.slice(1)} Initiated`,
                    `${txDetails.description} - Amount: $${amount} ${currency}`
                ]
            );

            await connection.commit();

            return NextResponse.json({
                success: true,
                message: 'Transaction completed successfully',
                transactionId: result.insertId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Transaction failed:', error);
        return NextResponse.json(
            { error: 'Transaction failed' },
            { status: 500 }
        );
    }
}