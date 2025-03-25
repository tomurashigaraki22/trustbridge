import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

interface AdminCheck extends RowDataPacket {
    is_admin: number;
}

interface User extends RowDataPacket {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country: string;
    status: string;
    kyc_status: string;
    two_factor_enabled: boolean;
    last_login: Date;
    login_ip: string;
    btc_balance: string;
    eth_balance: string;
    usdt_balance: string;
    bnb_balance: string;
    xrp_balance: string;
    ada_balance: string;
    doge_balance: string;
    sol_balance: string;
    dot_balance: string;
    matic_balance: string;
    link_balance: string;
    uni_balance: string;
    avax_balance: string;
    ltc_balance: string;
    shib_balance: string;
    created_at: Date;
    updated_at: Date;
    is_admin: number;
}

export async function GET(req: Request) {
    try {
        const headersList = headers();
        const token = (await headersList).get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log(req)
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        // Verify admin status with proper typing
        const [adminCheck] = await pool.query<AdminCheck[]>(
            'SELECT is_admin FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (!adminCheck[0]?.is_admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Get users with proper typing
        const [users] = await pool.query<User[]>(`
            SELECT 
                id,
                email,
                username,
                first_name,
                last_name,
                phone_number,
                country,
                status,
                kyc_status,
                two_factor_enabled,
                last_login,
                login_ip,
                btc_balance,
                eth_balance,
                usdt_balance,
                bnb_balance,
                xrp_balance,
                ada_balance,
                doge_balance,
                sol_balance,
                dot_balance,
                matic_balance,
                link_balance,
                uni_balance,
                avax_balance,
                ltc_balance,
                shib_balance,
                created_at,
                updated_at,
                is_admin
            FROM users 
            ORDER BY created_at DESC
        `);

        return NextResponse.json({ success: true, users });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}