// app/api/notifications/read-all/route.js
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || 'secret'));

    await Notification.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ 
      success: true,
      message: "All notifications marked as read"
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}