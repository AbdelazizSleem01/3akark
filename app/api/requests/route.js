// api/requests/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Request from '@/models/Request';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, whatsapp, email, message, propertyId } = body;

    await connectDB();

    if (!name || !whatsapp || !email || !propertyId) {
      return NextResponse.json(
        { success: false, message: 'الرجاء إدخال جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    const newRequest = new Request({
      name,
      whatsapp,
      email,
      message: message || '',
      propertyId
    });

    await newRequest.save();

    return NextResponse.json({ 
      success: true, 
      message: 'تم إرسال الطلب بنجاح',
      data: newRequest
    });

  } catch (err) {
    console.error('🚨 Error in /api/requests:', err);
    return NextResponse.json(
      { success: false, message: 'فشل في إرسال الطلب' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const requests = await Request.find()
      .populate('propertyId')
      .sort({ createdAt: -1 })
      .lean();

    // Convert _id to string
    const cleanRequests = requests.map(req => ({
      ...req,
      _id: req._id.toString(),
      propertyId: req.propertyId
        ? { ...req.propertyId, _id: req.propertyId._id.toString() }
        : null
    }));

    return NextResponse.json({ success: true, data: cleanRequests });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'فشل في تحميل الطلبات' }, { status: 500 });
  }
}