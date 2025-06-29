import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { notifyAdmin } from "@/lib/notifyAdmin";
import { jwtVerify } from "jose";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

async function getUserIdFromToken(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.replace("Bearer ", "");
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload?.id || null;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

export async function PUT(req, { params }) {
  const id = await params.id;
  await connectDB();

  try {
    const formData = await req.formData();
    const performedBy = await getUserIdFromToken(req);

    const title = formData.get("title");
    const type = formData.get("type");
    const area = formData.get("area");
    const location = formData.get("location");
    const price = formData.get("price");
    const description = formData.get("description");
    const existingImages = JSON.parse(formData.get("existingImages") || "[]");

    const newImages = [];
    const imageFiles = formData.getAll("images");

    for (const imageFile of imageFiles) {
      if (imageFile instanceof Blob) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = `${Date.now()}-${imageFile.name}`;
        const filePath = path.join(UPLOAD_DIR, filename);

        if (!fs.existsSync(UPLOAD_DIR)) {
          fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        fs.writeFileSync(filePath, buffer);
        newImages.push(`/uploads/${filename}`);
      }
    }

    const allImages = [...existingImages, ...newImages];

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        title,
        type,
        area,
        location,
        price,
        description,
        images: allImages,
      },
      { new: true }
    );

    if (performedBy && updatedProperty) {
      await notifyAdmin({
        action: "update",
        entity: "property",
        entityId: updatedProperty._id,
        performedBy,
      });
    }

    return NextResponse.json({
      success: true,
      message: "تم التعديل بنجاح",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const id = await params?.id;
    const performedBy = await getUserIdFromToken(req);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "لم يتم تحديد المعرف" },
        { status: 400 }
      );
    }

    const property = await Property.findById(id);
    if (property?.images?.length) {
      for (const imagePath of property.images) {
        const filePath = path.join(process.cwd(), "public", imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "العقار غير موجود" },
        { status: 404 }
      );
    }

    if (performedBy) {
      await notifyAdmin({
        action: "delete",
        entity: "property",
        entityId: deleted._id,
        performedBy,
      });
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف العقار بنجاح",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, context) {
  const { params } = await context;
  const id = params.id;

  await connectDB();

  try {
    const property = await Property.findById(id).lean();

    if (!property) {
      return NextResponse.json(
        { success: false, message: "العقار غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
