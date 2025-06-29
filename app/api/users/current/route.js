// /api/users/current/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User.js';
import { jwtVerify } from 'jose';

export async function GET(req) {
  await connectDB();

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Token missing' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'secret')
    );

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    });
  } catch (err) {
    console.error('JWT Error:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
