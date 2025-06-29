import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User.js';
import Notification from '@/models/Notification.js'; // ✅ استدعاء الموديل
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { name, email, password } = await req.json();

  await connectDB();

  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ success: false, message: 'البريد مستخدم من قبل' });
  }

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashed,
    role: 'user',
    permissions: {
      create: false,
      edit: false,
      delete: false,
      view: true,
    },
  });

  await newUser.save();

  await Notification.create({
    action: 'create',
    entity: 'user',
    entityId: newUser._id,
    performedBy: newUser._id, 
    message: `تسجيل مستخدم جديد: ${name} - ${email}`,
  });

  return NextResponse.json({ success: true, message: 'تم إنشاء الحساب بنجاح' });
}
