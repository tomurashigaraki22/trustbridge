import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    email: string;
    status: string;
    kyc_status: string;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    country: string;
    two_factor_enabled: boolean;
    last_login: Date;
    login_ip: string;
    created_at: Date;
}

interface NoticeCount extends RowDataPacket {
    count: number;
}

export async function GET(req: Request) {
  try {
    const headersList = headers();
    const authHeader = (await headersList).get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
     const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
        email: string;
        status: string;
        kycStatus: string;
      };
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user data
    // Update user query
    const [users] = await pool.query<User[]>(
        `SELECT 
            id,
            email,
            status,
            kyc_status,
            username,
            first_name,
            last_name,
            phone_number,
            country,
            two_factor_enabled,
            last_login,
            login_ip,
            created_at
        FROM users 
        WHERE id = ?`,
        [decoded.userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Check account status
    if (user.status !== 'active') {
      const statusMessages = {
        suspended: 'Your account has been suspended. Please contact support.',
        blocked: 'Your account has been blocked. Please contact support.',
        pending: 'Your account is pending activation. Please check your email.'
      };

      return NextResponse.json({
        error: statusMessages[user.status as keyof typeof statusMessages] || 'Account inactive',
        status: user.status,
        requireLogout: true
      }, { status: 403 });
    }

    // Get unread notices count
    // Update notices count query
    const [noticesCount] = await pool.query<NoticeCount[]>(
        `SELECT COUNT(*) as count 
         FROM account_notices 
         WHERE user_id = ? AND is_read = false`,
        [decoded.userId]
    );

    return NextResponse.json({
      user: {
        ...users[0],
        unreadNotices: noticesCount[0].count
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}