import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User.js';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectDB();
  const users = await User.find({}, { password: 0 }); // استبعاد الباسورد
  return NextResponse.json(users);
}

export async function POST(req) {
  const { name, email, password, role, permissions } = await req.json();

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
    role,
    permissions
  });

  await newUser.save();

  return NextResponse.json({ success: true, message: 'تم إنشاء المستخدم' });
}
