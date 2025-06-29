import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  await connectDB();

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET || 'secret')
  );

  const userId = payload.id;
  const { name, email, currentPassword, newPassword } = await req.json();

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  const notifications = [];

  // تعديل الاسم
  if (name && name !== user.name) {
    notifications.push(`قام المستخدم بتغيير الاسم من "${user.name}" إلى "${name}"`);
    user.name = name;
  }

  // تعديل الإيميل
  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ success: false, message: 'الإيميل مستخدم بالفعل' }, { status: 400 });
    }
    notifications.push(`قام المستخدم "${user.name}" بتغيير البريد الإلكتروني من "${user.email}" إلى "${email}"`);
    user.email = email;
  }

  // تعديل الباسورد
  if (currentPassword && newPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    notifications.push(`قام المستخدم "${user.name}" بتغيير كلمة المرور الخاصة به`);
  }

  await user.save();

  // حفظ الإشعارات للأدمن
  for (const msg of notifications) {
    await Notification.create({
      action: 'update',
      entity: 'user',
      performedBy: user._id,
      message: msg
    });
  }

  return NextResponse.json({ success: true, message: 'تم تحديث البيانات بنجاح' });
}
