// app/api/stats/route.js
import { connectDB } from '@/lib/mongodb';
import Property from '@/models/Property';
import Request from '@/models/Request';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const [propertyCount, requestCount, userCount] = await Promise.all([
      Property.countDocuments(),
      Request.countDocuments(),
      User.countDocuments()
    ]);

    return new Response(JSON.stringify({
      propertyCount,
      requestCount,
      userCount
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}