// app/api/notifications/[id]/read/route.js
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || 'secret'));

    const notification = await Notification.findByIdAndUpdate(
      params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      notification 
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}