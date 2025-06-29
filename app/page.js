// app/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "./context/UserContext";
import {
  Home,
  Smile,
  MapPin,
  DollarSign,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Footer from "./components/Footer";

export default function HomePage() {
  const { user } = useUser();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties/latest?limit=3");
        const data = await res.json();
        setProperties(data.properties || []);
      } catch (err) {
        console.error("فشل في تحميل العقارات:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Home className="w-6 h-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">
            مرحبًا {user?.name || "مستخدم"} 👋
          </h1>
        </div>
        <p className="text-gray-600 mb-8">يسعدنا رؤيتك.</p>

        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">أحدث العقارات</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 bg-base-100 rounded-lg">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-lg font-medium text-primary">
              جاري التحميل، الرجاء الانتظار...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
              >
                <figure>
                  <img
                    src={property.images?.[0] || "/no-image.jpg"}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    loading="lazy"
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-lg font-bold">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-700 font-bold mt-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{property.price} جنيه</span>
                  </div>
                  <div className="card-actions mt-4">
                    <Link
                      href={`/properties/${property._id}`}
                      className="btn btn-primary w-full"
                    >
                      عرض التفاصيل
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/properties" className="btn btn-primary px-8">
            عرض المزيد من العقارات
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
