// app/api/notifications/unread-count/route.js
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || 'secret'));

    const count = await Notification.countDocuments({ 
      isRead: false 
    });

    return NextResponse.json({ 
      success: true, 
      count 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}