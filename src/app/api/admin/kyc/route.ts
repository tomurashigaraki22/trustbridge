import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { gunzip } from 'zlib';
import { promisify } from 'util';

const gunzipAsync = promisify(gunzip);

async function decompressUrl(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const compressedData = await response.arrayBuffer();
        const decompressedData = await gunzipAsync(Buffer.from(compressedData));
        return `data:image/jpeg;base64,${decompressedData.toString('base64')}`;
    } catch (error) {
        console.error('Failed to decompress URL:', error);
        return url; // Return original URL if decompression fails
    }
}

interface KYCDocument extends RowDataPacket {
    id: number;
    user_id: number;
    document_type: string;
    document_number: string;
    document_front_url: string;
    document_back_url: string;
    status: string;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
}

export async function GET(request: Request) {
    try {
        // Verify admin authorization
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        // Check if user is admin
        const [adminCheck] = await pool.query<KYCDocument[]>(
            'SELECT is_admin FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (!adminCheck[0]?.is_admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch KYC documents with user information
        const [documents] = await pool.query<KYCDocument[]>(`
            SELECT 
                kd.*,
                u.first_name,
                u.last_name,
                u.email
            FROM kyc_documents kd
            JOIN users u ON kd.user_id = u.id
            ORDER BY kd.created_at DESC
        `);

        // Format and decompress URLs
        const formattedDocuments = await Promise.all(documents.map(async doc => ({
            id: doc.id,
            user_id: doc.user_id,
            document_type: doc.document_type,
            document_number: doc.document_number,
            document_front_url: await decompressUrl(doc.document_front_url),
            document_back_url: await decompressUrl(doc.document_back_url),
            status: doc.status,
            created_at: doc.created_at,
            user: {
                first_name: doc.first_name,
                last_name: doc.last_name,
                email: doc.email
            }
        })));

        return NextResponse.json({
            success: true,
            documents: formattedDocuments
        });

    } catch (error) {
        console.error('Failed to fetch KYC documents:', error);
        return NextResponse.json({ 
            success: false,
            error: 'Failed to fetch KYC documents' 
        }, { status: 500 });
    }
}