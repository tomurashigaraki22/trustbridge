import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const [investments] = await pool.query(
            `SELECT 
                i.*,
                p.id AS package_id,
                p.name AS plan_name,
                p.description,
                p.duration_days,
                p.min_roi,
                p.max_roi,
                p.risk_level,
                p.features,
                p.min_amount_usd,
                p.max_amount_usd,
                p.is_active,
                p.created_at AS package_created_at
            FROM user_investments i
            JOIN investment_packages p ON i.package_id = p.id
            WHERE i.user_id = ?
            ORDER BY i.start_date DESC`,
            [params.id]
        );

        return NextResponse.json({
            success: true,
            investments
        });
    } catch (error) {
        console.error('Failed to fetch investments:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch investments' },
            { status: 500 }
        );
    }
}