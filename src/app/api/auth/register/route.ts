import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface ExistingUser extends RowDataPacket {
    id: number;
    email: string;
}

interface UserName extends RowDataPacket {
    id: number;
}

export async function POST(req: Request) {
  try {
    const { email, password, first_name, last_name, phone_number, country } = await req.json();
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

    // Check if user already exists
    // Update existing users check
    const [existingUsers] = await pool.query<ExistingUser[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique username
    async function generateUniqueUsername(): Promise<string> {
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let username;
      let isUnique = false;
      
      while (!isUnique) {
        username = Array.from({ length: 5 }, () => 
          characters.charAt(Math.floor(Math.random() * characters.length))
        ).join('');
        
        // Update username check in generateUniqueUsername
        const [existing] = await pool.query<UserName[]>(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );
        
        if (existing.length === 0) {
          isUnique = true;
        }
      }
      return username as string;
    }

    const username = await generateUniqueUsername();

    // Insert new user with additional fields
    // Update user insert
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO users (
            email, 
            password,
            username,
            first_name,
            last_name,
            phone_number,
            country, 
            status,
            kyc_status,
            login_ip,
            last_login,
            btc_balance,
            eth_balance,
            usdt_balance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', 'none', ?, NOW(), 0, 0, 0)`,
        [email, hashedPassword, username, first_name, last_name, phone_number, country, ip]
    );

    // Create welcome notice
    await pool.query(
      `INSERT INTO account_notices (
        user_id,
        type,
        title,
        message
      ) VALUES (?, 'system', 'Welcome to CryptoApp', 'Thank you for joining!')`,
      [result.insertId]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.insertId, 
        email,
        status: 'active',
        kycStatus: 'none'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: { 
        id: result.insertId, 
        email,
        username,
        first_name,
        last_name,
        phone_number,
        country,
        status: 'active',
        kycStatus: 'none',
        lastLogin: new Date(),
        loginIp: ip
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}