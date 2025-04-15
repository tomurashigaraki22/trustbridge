import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import nodemailer from 'nodemailer';

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

    // Send welcome email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome ${first_name},</h2>
          <p>Thank you for joining ${process.env.NEXT_PUBLIC_APP_NAME}. We're delighted to have you as part of our community.</p>
          <p>To get started with your account:</p>
          <ul style="padding-left: 20px;">
            <li>Complete your profile information</li>
            <li>Explore our investment opportunities</li>
            <li>Set up your security preferences</li>
          </ul>
          <p>Our team is available to assist you with any questions you may have about our platform.</p>
          <p>We're committed to providing you with a seamless experience.</p>
          <p>Best regards,</p>
          <p>The ${process.env.NEXT_PUBLIC_APP_NAME} Team</p>
        </div>
      `,
    });

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