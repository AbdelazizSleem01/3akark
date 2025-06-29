import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sign } from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  await connectDB();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "البريد غير مسجل" },
      { status: 404 }
    );
  }

  const token = sign(
    { id: user._id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "15m" }
  );

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">إعادة تعيين كلمة المرور</h1>
      </div>
      
      <div style="padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://cdn-icons-png.flaticon.com/512/3064/3064155.png" alt="Password Reset" style="width: 120px; height: auto;">
        </div>
        
        <p style="font-size: 16px; color: #4a5568; margin-bottom: 20px;">
          مرحباً ${user.name || "عزيزي المستخدم"}،
        </p>
        
        <p style="font-size: 16px; color: #4a5568; margin-bottom: 20px;">
          لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. يمكنك إعادة تعيين كلمة المرور من خلال الضغط على الزر أدناه:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="display: inline-block; background-color: #3b82f6; color: white; 
                    padding: 12px 24px; border-radius: 4px; text-decoration: none; 
                    font-weight: bold; font-size: 16px;">
            إعادة تعيين كلمة المرور
          </a>
        </div>
        
        <p style="font-size: 14px; color: #718096; margin-bottom: 20px;">
          إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني بأمان.
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Company Logo" style="width: 40px; height: auto; margin-bottom: 10px;">
          <p style="font-size: 12px; color: #a0aec0;">
            © ${new Date().getFullYear()} نظام إدارة العقارات. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"نظام إدارة العقارات" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "إعادة تعيين كلمة المرور - نظام إدارة العقارات",
    html: emailHtml,
  });

  return NextResponse.json({ success: true });
}