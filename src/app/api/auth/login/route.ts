import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    email: string;
    password: string;
    status: string;
    kyc_status: string;
    is_admin: number;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const headersList = headers();
    const ip = (await headersList).has('x-forwarded-for')
      ? (await headersList).get('x-forwarded-for')?.split(',')[0]
      : 'unknown';

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user with proper typing
    const [users] = await pool.query<User[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0]; 

    // Check if user is admin
    const is_admin = Boolean(user.is_admin);

    console.log('admin:' + is_admin)
    
    // Check account status
    switch (user.status) {
      case 'blocked':
        return NextResponse.json(
          { error: 'Account has been blocked. Please contact support.' },
          { status: 403 }
        );
      case 'suspended':
        return NextResponse.json(
          { error: 'Account has been suspended. Please contact support.' },
          { status: 403 }
        );
      case 'pending':
        return NextResponse.json(
          { error: 'Account is pending activation. Please check your email.' },
          { status: 403 }
        );
      case 'active':
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid account status' },
          { status: 403 }
        );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login and IP
    await pool.query(
      'UPDATE users SET last_login = NOW(), login_ip = ? WHERE id = ?',
      [ip, user.id]
    );

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        status: user.status,
        kycStatus: user.kyc_status,
        is_admin
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Create login notice
    await pool.query(
      `INSERT INTO account_notices (
        user_id,
        type,
        title,
        message
      ) VALUES (?, 'security', 'New Login Detected', 'A new login was detected from ${ip}')`,
      [user.id]
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
        kycStatus: user.kyc_status,
        is_admin, // Add is_admin to response
        lastLogin: new Date(),
        loginIp: ip
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}