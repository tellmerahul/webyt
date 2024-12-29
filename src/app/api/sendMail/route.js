import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Function to generate the email HTML content
const getEmailHtml = (Name, Website) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4caf50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content h2 {
            color: #333;
            font-size: 22px;
            margin-top: 0;
        }
        .content p {
            margin: 16px 0;
        }
        .cta-button {
            display: block;
            width: 200px;
            text-align: center;
            margin: 30px auto;
            background-color: #4caf50;
            color: white;
            text-decoration: none;
            padding: 12px 0;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
        }
        .cta-button:hover {
            background-color: #45a049;
        }
        .footer {
            background-color: #f1f1f1;
            color: #555;
            text-align: center;
            padding: 10px;
            font-size: 14px;
        }
        .footer a {
            color: #4caf50;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Your Website is Now Live! 🎉</h1>
        </div>
        <div class="content">
            <h2>Dear ${Name},</h2>
            <p>We are excited to inform you that your website has been successfully created and is now live!</p>
            <p>You can access your website using the link below:</p>
            <a href=${Website} class="cta-button">Visit Your Website</a>
            <p>Here are some highlights of your new website:</p>
            <ul>
                <li><strong>Responsive Design</strong>: Optimized for all devices—desktop, tablet, and mobile.</li>
                <li><strong>Easy Navigation</strong>: Smooth and user-friendly navigation experience.</li>
                <li><strong>Customized Features</strong>: Tailored to your specific requirements.</li>
            </ul>
            <p>If you have any questions or need further adjustments, feel free to reach out. We're here to help make sure everything runs perfectly!</p>
            <p>Thank you for choosing us for your project, and we look forward to seeing your website grow!</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p><strong>[Your Name]</strong></p>
            <p><strong>[Your Company Name]</strong></p>
            <p><a href="[Company Website]">Visit Our Website</a></p>
        </div>
    </div>
</body>
</html>
`;

export async function POST(req) {
    const { name, email, website } = await req.json();
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GPASSWORD,
            },
        });

        const emailHtml = getEmailHtml(name, website);

        const options = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Your Website is Live! 🎉',
            html: emailHtml,
        };

        await transporter.sendMail(options);
        
        return NextResponse.json({ message: 'Email sent successfully', success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Error processing request: ${error.message}`, success: false }, { status: 500 });
    }
}