import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import { Home, MapPin, Ruler, DollarSign, Type } from "lucide-react";
import Pagination from "../components/Pagination";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: " عقاراتــك | جميع العقارات المعروضة ",
    description:
      "استعرض جميع العقارات المتاحة للبيع أو الإيجار في نظام إدارة العقارات مع تفاصيل كاملة وصور.",
    keywords: ["عقارات", "بيع", "إيجار", "إدارة عقارات", "عقار", "وحدات سكنية"],
    openGraph: {
      title: "جميع العقارات المعروضة",
      description: "اعثر على أفضل العقارات المعروضة في السوق حالياً.",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/properties`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "جميع العقارات | نظام إدارة العقارات",
      description: "تصفح جميع العقارات المعروضة حالياً",
    },
  };
}

async function getProperties(page = 1, limit = 12) {
  await connectDB();
  const skip = (page - 1) * limit;
  const properties = await Property.find()
    .select("title price area type location images createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Property.countDocuments();
  return { properties, total };
}

export default async function PropertiesPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const limit = 12;
  const { properties, total } = await getProperties(page, limit);
  const totalPages = Math.ceil(total / limit);

  if (!properties.length) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="max-w-md mx-auto space-y-4">
          <Home className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="text-xl font-medium text-gray-600">
            لا توجد عقارات متاحة حالياً
          </h3>
          <p className="text-gray-500">
            يرجى التحقق لاحقاً أو إضافة عقارات جديدة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {properties.map((prop) => (
          <div
            key={prop._id.toString()}
            className="card bg-white shadow-md shadow-blue-600 hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
          >
            <figure className="relative aspect-video">
              <img
                src={prop.images?.[0] || "/placeholder.png"}
                alt={prop.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h2 className="text-white font-bold text-lg truncate">
                  {prop.title}
                </h2>
              </figcaption>
            </figure>

            <div className="card-body p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="text-green-500 w-4 h-4" />
                <span className="font-medium">
                  {Intl.NumberFormat("ar-EG").format(prop.price)} ج.م
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Ruler className="text-blue-500 w-4 h-4" />
                <span>{prop.area} م²</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Type className="text-purple-500 w-4 h-4" />
                <span>{prop.type}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="text-red-500 w-4 h-4" />
                <span className="truncate">{prop.location}</span>
              </div>

              <div className="card-actions justify-end pt-2">
                <Link
                  href={`/properties/${prop._id}`}
                  className="btn btn-sm btn-primary w-full"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
