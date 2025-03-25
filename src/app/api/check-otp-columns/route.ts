import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export async function GET() {
    try {
        // Check otp_status column
        const [checkOtpStatus] = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = 'otp_status';
        `);
            console.log('checked table for status')
        // Check otp_code column
        const [checkOtpCode] = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = 'otp_code';
        `);
        console.log('checked table for code')

        // Add otp_status if it doesn't exist
        if ((checkOtpStatus as any[]).length === 0 || (checkOtpCode as any[]).length === 0) {
            await pool.query(`
                ALTER TABLE users 
                ADD COLUMN otp_status VARCHAR(10)  
                DEFAULT 'pending' 
                CHECK (otp_status IN ('active', 'pending'));
            `);
       
            await pool.query(`
                ALTER TABLE users 
                ADD COLUMN otp_code VARCHAR(6) DEFAULT NULL;
            `);
        }
        console.log('checked table for code')

        return NextResponse.json({ 
            success: true, 
            message: 'OTP columns checked/added successfully' 
        });

    } catch (error) {
        console.error('Error checking/adding OTP columns:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to check/add OTP columns' 
        }, { status: 500 });
    }
}