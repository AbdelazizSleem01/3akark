import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import mongoose from "mongoose";
import { jwtVerify } from "jose";
import { notifyAdmin } from "@/lib/notifyAdmin";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "secret")
    );

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "معرف الطلب غير صالح" },
        { status: 400 }
      );
    }

    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json(
        { success: false, message: "لم يتم العثور على الطلب" },
        { status: 404 }
      );
    }

    await notifyAdmin({
      action: "delete",
      entity: "request",
      entityId: deletedRequest._id,
      performedBy: payload.id,
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف الطلب بنجاح",
      data: deletedRequest,
    });
  } catch (err) {
    console.error("🚨 Error deleting request:", err);
    return NextResponse.json(
      { success: false, message: "فشل في حذف الطلب" },
      { status: 500 }
    );
  }
}

// get
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "معرف الطلب غير صالح" },
        { status: 400 }
      );
    }

    const request = await Request.findById(id).populate("propertyId");

    if (!request) {
      return NextResponse.json(
        { success: false, message: "لم يتم العثور على الطلب" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: request,
    });
  } catch (err) {
    console.error("🚨 Error fetching request:", err);
    return NextResponse.json(
      { success: false, message: "فشل في جلب الطلب" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await connectDB();

  const body = await req.json();
  const { name, email, whatsapp, message } = body;

  try {
    const updated = await Request.findByIdAndUpdate(
      params.id,
      { name, email, whatsapp, message },
      { new: true }
    );
    return Response.json({ success: true, data: updated });
  } catch (err) {
    return Response.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
