// /app/api/requests/user/route.js

import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const { email } = body;

  if (!email) {
    return Response.json({ success: false, message: "البريد مفقود" }, { status: 400 });
  }

  try {
    const requests = await Request.find({ email }).populate("propertyId");
    return Response.json({ success: true, data: requests });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
