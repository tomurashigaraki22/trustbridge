import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import { generateRandom9DigitInteger } from "../../../../../scripts/generateId";
import jwt from "jsonwebtoken";
import { RowDataPacket } from 'mysql2';

interface Investment extends RowDataPacket {
    id: number;
    user_id: number;
    package_id: number;
    amount_usd: number;
    currency: string;
    status: string;
    start_date: Date;
    daily_roi: string;
    package_name: string;
}

export async function POST(req: Request) {
    try {
        const headersList = headers();
        const authHeader = (await headersList).get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const { investmentId } = await req.json();

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Get investment details
            const [investments] = await connection.query<Investment[]>(
                `SELECT ui.*, ip.name as package_name 
                 FROM user_investments ui 
                 JOIN investment_packages ip ON ui.package_id = ip.id 
                 WHERE ui.id = ? AND ui.user_id = ? AND ui.status = "active"`,
                [investmentId, decoded.userId]
            );

            if (!investments.length) {
                throw new Error('Investment not found or already claimed');
            }

            const investment = investments[0];
            const currentDate = new Date();
            const startDate = new Date(investment.start_date);
            const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const dailyRoi = JSON.parse(investment.daily_roi);

            // Calculate total accumulated amount
            let totalAccumulatedAmount = Number(investment.amount_usd);
            for (let i = 0; i <= daysPassed && i < dailyRoi.length; i++) {
                const dailyReturn = Number(dailyRoi[i]);
                totalAccumulatedAmount = totalAccumulatedAmount + ((totalAccumulatedAmount * dailyReturn) / 100);
            }

            // Calculate profit
            const profit = totalAccumulatedAmount - investment.amount_usd;

            // Update user's balance
            const balanceColumn = `${investment.currency.toLowerCase()}_balance`;
            await connection.query(
                `UPDATE users SET ${balanceColumn} = ${balanceColumn} + ? WHERE id = ?`,
                [profit, decoded.userId]
            );
            const id = generateRandom9DigitInteger();

            // Create notice
            await connection.query(
                `INSERT INTO account_notices 
    (id, user_id, type, title, message) 
    VALUES (?, ?, 'transaction', ?, ?)`,
                [
                    id,
                    decoded.userId,
                    'Transaction Successful',
                    `Claimed Profit of $${profit} from ${investment.package_name} investment`

                ]
            );

            await connection.commit();


            // Update investment status
            await connection.query(
                'UPDATE user_investments SET status = "completed" WHERE id = ? AND user_id = ?',
                [investmentId, decoded.userId]
            );

            // Add transaction record
            await connection.query(
                `INSERT INTO transactions (user_id, type, currency, amount, status, description,tx_hash) 
                VALUES (?, 'investment', ?, ?, 'completed', ?,'cashout')`,
                [
                    decoded.userId,
                    investment.currency,
                    profit,
                    `Profit claimed from ${investment.package_name} investment`
                ]
            );

            await connection.commit();
            return NextResponse.json({
                success: true,
                profit,
                totalAccumulatedAmount
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to claim profit:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to claim profit" },
            { status: 500 }
        );
    }
}