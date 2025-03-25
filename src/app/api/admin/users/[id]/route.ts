import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = headers();
    const authHeader = (await headersList).get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, is_admin: boolean };

    if (!decoded.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');

      // Delete from all tables except users
      const userRelatedTables = [
        'account_notices',
        'api_keys',
        'crypto_holdings',
        'kyc_documents',
        'password_resets',
        'social_accounts',
        'spot_transactions',
        'trades',
        'transactions',
        'user_investments',
        'user_trading_sessions',
        'wallet_addresses',
        'account_info'
      ];

      await Promise.all(
        userRelatedTables.map(table => 
          connection.query(`DELETE FROM ${table} WHERE user_id = ?`, [params.id])
        )
      );

      // Delete the user with correct column name
      await connection.query('DELETE FROM users WHERE id = ?', [params.id]);

      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      await connection.commit();
      return NextResponse.json({ success: true });
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      console.error('Failed to delete user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete user' },
        { status: 500 }
      );
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}