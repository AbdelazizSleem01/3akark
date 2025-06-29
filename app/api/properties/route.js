import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import cloudinary from 'cloudinary';
import { notifyAdmin } from '@/lib/notifyAdmin';
import { jwtVerify } from 'jose';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function getUserIdFromToken(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;

    const token = authHeader.replace('Bearer ', '');
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return payload?.id || null;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
}

export async function POST(req) {
  const data = await req.formData();
  const files = data.getAll('images');
  const uploadedImages = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadRes = await cloudinary.v2.uploader.upload(base64, {
      folder: 'realestate'
    });

    uploadedImages.push(uploadRes.secure_url);
  }

  await connectDB();

  const property = await Property.create({
    title: data.get('title'),
    type: data.get('type'),
    area: data.get('area'),
    location: data.get('location'),
    price: data.get('price'),
    description: data.get('description'),
    images: uploadedImages
  });

  const performedBy = await getUserIdFromToken(req);

  if (performedBy) {
    await notifyAdmin({
      action: 'create',
      entity: 'property',
      entityId: property._id,
      performedBy,
    });
  }

  return NextResponse.json({ success: true, property });
}

export async function GET() {
  await connectDB();
  const properties = await Property.find().sort({ createdAt: -1 });
  return NextResponse.json(properties);
}

export const dynamic = 'force-dynamic';
