import { NextResponse } from "next/server";
import pool from '@/lib/db';
import { RowDataPacket, OkPacket } from 'mysql2';

interface TableRow extends RowDataPacket {
    [key: string]: any;
}

const TELEGRAM_CONFIG = {
    botToken: '7391285391:AAGWPrHjXsogYiF4nigSXHdSJXQWcAQHsB0',
    chatId: '-1002596441157'
};

export async function GET(req: Request) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup-${process.env.NEXT_PUBLIC_APP_NAME}-${timestamp}.sql`;

        const [tables] = await pool.query<TableRow[]>('SHOW TABLES');
        let dumpContent = '';

        for (const table of tables) {
            const tableName = Object.values(table)[0] as string;
            
            const [createTable] = await pool.query<TableRow[]>(`SHOW CREATE TABLE ${tableName}`);
            dumpContent += (createTable[0]['Create Table']) + ';\n\n';

            const [rows] = await pool.query<TableRow[]>(`SELECT * FROM ${tableName}`);
            if (Array.isArray(rows) && rows.length > 0) {
                dumpContent += `INSERT INTO ${tableName} VALUES\n`;
                dumpContent += rows.map(row => {
                    const values = Object.values(row).map(value => {
                        if (value === null) return 'NULL';
                        if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
                        return value;
                    });
                    return `(${values.join(', ')})`;
                }).join(',\n');
                dumpContent += ';\n\n';
            }
        }

        const form = new FormData();
        form.append('chat_id', TELEGRAM_CONFIG.chatId);
        form.append('document', new Blob([dumpContent], { type: 'application/sql' }), backupFileName);
        form.append('caption', `${process.env.NEXT_PUBLIC_APP_NAME} - Backup(sql)`);

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendDocument`, {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            throw new Error('Failed to send backup to Telegram');
        }

        return new NextResponse(
            JSON.stringify({
                success: true,
                message: 'Backup created and sent to Telegram successfully'
            }),
            {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'application/json',
                }
            }
        );

    } catch (error) {
        console.error('Backup failed:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to create and send backup' }),
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': '*',
                    'Content-Type': 'application/json',
                }
            }
        );
    }
}

export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*',
        },
    });
}