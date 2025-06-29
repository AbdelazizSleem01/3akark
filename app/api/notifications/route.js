import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "secret")
    );

    // جلب الإشعارات الخاصة بالمستخدم فقط
    const notifications = await Notification.find({})
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });

    // حساب عدد الإشعارات غير المقروءة
    const unreadCount = await Notification.countDocuments({
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  await connectDB();
  await Notification.deleteMany({});
  return NextResponse.json({ success: true, message: "تم حذف جميع الإشعارات" });
}
