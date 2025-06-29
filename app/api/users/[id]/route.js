import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User.js";
import { notifyAdmin } from "@/lib/notifyAdmin";
import { jwtVerify } from "jose";

// استخراج userId من التوكن
async function getUserIdFromToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.replace("Bearer ", "");
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return payload?.id || null;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

export async function PUT(req, context) {
  const { params } = context;
  const { id } = params;
  const body = await req.json();

  await connectDB();
  const updatedUser = await User.findByIdAndUpdate(id, body);

  const performedBy = await getUserIdFromToken(req);
  if (performedBy && updatedUser) {
    await notifyAdmin({
      action: "update",
      entity: "user",
      entityId: updatedUser._id,
      performedBy,
    });
  }

  return NextResponse.json({ success: true, message: "تم تحديث المستخدم" });
}

export async function DELETE(req, context) {
  const { params } = context;
  const { id } =await params;

  await connectDB();
  const deletedUser = await User.findByIdAndDelete(id);

  const performedBy = await getUserIdFromToken(req);
  if (performedBy && deletedUser) {
    await notifyAdmin({
      action: "delete",
      entity: "user",
      entityId: deletedUser._id,
      performedBy,
    });
  }

  return NextResponse.json({ success: true, message: "تم حذف المستخدم" });
}
