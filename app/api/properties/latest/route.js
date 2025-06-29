import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "3");

    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, properties });
  } catch (error) {
    console.error("Error fetching latest properties:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
