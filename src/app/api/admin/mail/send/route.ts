import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    email: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
}

export async function POST(req: Request) {
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

        const body = await req.json();
        const { recipients, selectedUserIds, subject, body: emailBody } = body;

        // Create email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const getEmailTemplate = (subject: string, content: string) => `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0; padding: 0; width: 100%; background-color: #f6f9fc;">
                    <tr>
                        <td align="center" style="padding: 45px 0;">
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0; padding: 0; width: 100%; max-width: 600px;">
                                <tr>
                                    <td align="center" style="background-color: #ffffff; padding: 45px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                                      
                                        
                                        <h1 style="color: #111827; font-size: 24px; font-weight: 600; text-align: center; margin: 0 0 25px 0; padding-bottom: 25px; border-bottom: 1px solid #e5e7eb;">
                                            ${subject}
                                        </h1>
                                        
                                        <div style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 35px; text-align: left;">
                                            ${content}
                                        </div>
                                        
                                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                <td style="padding-top: 30px; border-top: 1px solid #e5e7eb;">
                                                    <div style="text-align: center;">
                                                        <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                                                            © ${new Date().getFullYear()} All rights reserved.
                                                        </p>
                                                         
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        // Verify SMTP configuration
        try {
            await transporter.verify();
        } catch (error) {
            console.error("SMTP Configuration Error:", error);
            return NextResponse.json(
                { error: "Email service configuration error" },
                { status: 500 }
            );
        }

        const connection = await pool.getConnection();
        try {
            // Get user details for template variables
            let users: User[] = [];
            if (selectedUserIds && selectedUserIds.length > 0) {
                const [result] = await connection.query<User[]>(
                    `SELECT id, email, username, first_name, last_name 
                    FROM users 
                    WHERE id IN (?)`,
                    [selectedUserIds]
                );
                users = result;
            }

            // Define additional emails before using them
            const additionalEmails = recipients ? recipients.filter(
                (email: string) => !users.some(user => user.email === email)
            ) : [];

            // Send emails with error handling
            for (const user of users) {
                try {
                    const personalizedBody = emailBody
                        .replace(/{username}/g, user.username)
                        .replace(/{first_name}/g, user.first_name || '')
                        .replace(/{last_name}/g, user.last_name || '');

                    const info = await transporter.sendMail({
                        from: process.env.SMTP_FROM,
                        to: user.email,
                        subject,
                        html: getEmailTemplate(subject, personalizedBody),
                    });
                    console.log('Email sent to:', user.email, 'MessageId:', info.messageId);
                } catch (error) {
                    console.error('Failed to send email to:', user.email, error);
                    throw error;
                }
            }

            // Send to additional emails with error handling
            for (const email of additionalEmails) {
                try {
                    const info = await transporter.sendMail({
                        from: process.env.SMTP_FROM,
                        to: email,
                        subject,
                        html: getEmailTemplate(subject, emailBody),
                    });
                    console.log('Email sent to:', email, 'MessageId:', info.messageId);
                } catch (error) {
                    console.error('Failed to send email to:', email, error);
                    throw error; // Re-throw to handle in outer catch
                }
            }

            return NextResponse.json({
                success: true,
                message: "Emails sent successfully"
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Failed to send emails:", error);
        return NextResponse.json(
            { error: "Failed to send emails" },
            { status: 500 }
        );
    }
}