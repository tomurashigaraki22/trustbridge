import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { headers } from "next/headers"
import jwt from "jsonwebtoken"
import { RowDataPacket, ResultSetHeader } from 'mysql2'

interface InvestmentPackage extends RowDataPacket {
    id: number;
    name: string;
    min_amount_usd: number;
    max_amount_usd: number;
    min_roi: number;
    max_roi: number;
    duration_days: number;
    is_active: boolean;
}

interface UserBalance extends RowDataPacket {
    balance: number;
}

function generateRandom9DigitInteger(): number {
  return Math.floor(100000000 + Math.random() * 900000000);
}


export async function GET(req: Request) {
    try {
        console.log(req)


        // Fetch investment packages
        const connection = await pool.getConnection()
        try {
            const [packages] = await connection.query("SELECT * FROM investment_packages WHERE is_active = TRUE")


            return NextResponse.json({
                success: true,
                packages,
            })
        } finally {
            connection.release()
        }
    } catch (error) {
        console.error("Failed to fetch investments:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch investments" },
            { status: 500 },
        )
    }
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
        const { packageId, amountUsd, currency, autoCompound } = await req.json();

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Get package details
            const [packageDetails] = await connection.query<InvestmentPackage[]>(
                'SELECT * FROM investment_packages WHERE id = ? AND is_active = TRUE',
                [packageId]
            );

            if (!packageDetails.length) {
                throw new Error('Investment package not found or inactive');
            }

            const investmentPackage = packageDetails[0];

            // Validate amount
            if (amountUsd < investmentPackage.min_amount_usd || amountUsd > investmentPackage.max_amount_usd) {
                throw new Error('Amount is outside package limits');
            }

            // Check user's balance
            const balanceColumn = `${currency.toLowerCase()}_balance`;
            // Update user balance query
            const [userBalance] = await connection.query<UserBalance[]>(
                `SELECT ${balanceColumn} as balance FROM users WHERE id = ?`,
                [decoded.userId]
            );

            if (!userBalance.length || userBalance[0].balance < amountUsd) {
                throw new Error('Insufficient balance');
            }

            // Calculate end date
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + investmentPackage.duration_days);

            // Generate daily ROI array (random within package range)
            const dailyRoi = Array.from({ length: investmentPackage.duration_days }, () => {
                const minRoi = Number(investmentPackage.min_roi);
                const maxRoi = Number(investmentPackage.max_roi);
                const totalRoi = Math.random() * (maxRoi - minRoi) + minRoi;
                const dailyRate = (totalRoi * 10) / investmentPackage.duration_days;
                return Number(dailyRate.toFixed(2));
            });

            console.log('Daily ROI:', dailyRoi);
            const id = generateRandom9DigitInteger();

            // Create investment record
            const [investment] = await connection.query<ResultSetHeader>(
                `INSERT INTO user_investments 
                (user_id, package_id, amount_usd, currency, 
                 end_date, daily_roi, auto_compound) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    decoded.userId,
                    packageId,
                    amountUsd,
                    currency,
                    endDate,
                    JSON.stringify(dailyRoi),
                    autoCompound
                ]
            );

            // Get the inserted investment ID
            const investmentId = investment.insertId;

            await connection.query(
                `INSERT INTO transactions 
                (user_id, type, currency, amount, fee, status, to_address, description) 
                VALUES (?, 'investment', ?, ?, ?, 'completed', ?, ?)`,
                [
                    decoded.userId,
                    currency,
                    amountUsd,
                    '0.0005',
                    investmentId,
                    `Successfully invested $ ${amountUsd} in ${currency} into ${investmentPackage.name}`
                ]
            );

            // Deduct from user's balance
            await connection.query(
                `UPDATE users SET ${balanceColumn} = ${balanceColumn} - ? WHERE id = ?`,
                [amountUsd, decoded.userId]
            );


            // Create notice
            // Update notice message
            await connection.query(
                `INSERT INTO account_notices 
                (id, user_id, type, title, message) 
                VALUES (?, ?, 'transaction', ?, ?)`,
                [
                    id,
                    decoded.userId,
                    'Investment Started',
                    `Successfully invested ${amountUsd} ${currency} (${amountUsd} USD) in ${investmentPackage.name}`
                ]
            );

            await connection.commit();

            return NextResponse.json({
                success: true,
                message: 'Investment created successfully',
                investmentId: investment.insertId
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Investment creation failed:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Investment failed' },
            { status: 500 }
        );
    }
}