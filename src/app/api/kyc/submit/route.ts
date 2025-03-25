import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        // Get token from header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        const formData = await request.formData();
        const frontFile = formData.get('frontFile') as File;
        const backFile = formData.get('backFile') as File;
        const documentType = formData.get('documentType');
        const documentNumber = formData.get('documentNumber');

        // Upload front file
        const frontFormData = new FormData();
        const frontCompressedData = await frontFile.arrayBuffer();
        frontFormData.append('file', new Blob([frontCompressedData], { type: 'application/gzip' }), frontFile.name);

        const frontUploadResponse = await fetch(process.env.FILE_SERVER_URL!, {
            method: 'POST',
            body: frontFormData
        });

        if (!frontUploadResponse.ok) {
            throw new Error('Failed to upload front document');
        }

        const frontData = await frontUploadResponse.json();

        // Upload back file
        const backFormData = new FormData();
        const backCompressedData = await backFile.arrayBuffer();
        backFormData.append('file', new Blob([backCompressedData], { type: 'application/gzip' }), backFile.name);

        const backUploadResponse = await fetch(process.env.FILE_SERVER_URL!, {
            method: 'POST',
            body: backFormData
        });

        if (!backUploadResponse.ok) {
            throw new Error('Failed to upload back document');
        }

        const backData = await backUploadResponse.json();

        // Save KYC data to database
        await pool.query(
            `INSERT INTO kyc_documents (
                user_id, 
                document_type, 
                document_number, 
                document_front_url, 
                document_back_url, 
                status
            ) VALUES (?, ?, ?, ?, ?, 'pending')`,
            [decoded.userId, documentType, documentNumber, frontData.file_url, backData.file_url]
        );

        // Update user KYC status
        await pool.query(
            'UPDATE users SET kyc_status = ? WHERE id = ?',
            ['pending', decoded.userId]
        );

        return NextResponse.json({ 
            success: true, 
            message: 'KYC documents submitted successfully' 
        });

    } catch (error) {
        console.error('KYC submission error:', error);
        return NextResponse.json({ 
            error: 'Failed to submit KYC documents' 
        }, { status: 500 });
    }
}