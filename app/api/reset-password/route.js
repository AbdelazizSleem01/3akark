import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { token, password } = await req.json();

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "secret")
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(payload.id, { password: hashedPassword });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: "الرابط غير صالح أو انتهت صلاحيته" }, { status: 400 });
  }
}
