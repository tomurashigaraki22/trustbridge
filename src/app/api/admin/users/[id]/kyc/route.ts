import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function PATCH(
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

        const { kyc_status } = await req.json();

        // Validate KYC status
        const validStatuses = ['none', 'pending', 'verified', 'rejected'];
        if (!validStatuses.includes(kyc_status)) {
            return NextResponse.json(
                { error: "Invalid KYC status" },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();
        try {
            await connection.query(
                'UPDATE users SET kyc_status = ? WHERE id = ?',
                [kyc_status, params.id]
            );

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error('Failed to update KYC status:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to update KYC status' },
                { status: 500 }
            );
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Failed to update KYC status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update KYC status' },
            { status: 500 }
        );
    }
}