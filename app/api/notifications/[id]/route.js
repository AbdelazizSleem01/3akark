import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;

  await Notification.findByIdAndDelete(id);
  return NextResponse.json({ success: true, message: "تم حذف الإشعار" });
}
