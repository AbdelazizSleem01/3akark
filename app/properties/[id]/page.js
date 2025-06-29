import PropertyImageSlider from "@/app/components/PropertyImageSlider";
import RequestForm from "@/app/components/RequestForm";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property.js";
import { Home, MapPin, Ruler, DollarSign, Type, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";


export async function generateMetadata({ params }) {
  await connectDB();
  const property = await Property.findById(params.id)
    .select("title description location price")
    .lean();

  if (!property) return {};

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    title: `${property.title} | عقاراتـــك`,
    description: `${property.title} في ${
      property.location
    } بسعر ${property.price.toLocaleString()} ج.م. شاهد التفاصيل وتواصل معنا.`,
    keywords: [
      property.title,
      property.location,
      "عقار للبيع",
      "نظام عقارات",
      "شقق للبيع",
    ],
    openGraph: {
      title: property.title,
      description: `اعرف المزيد عن العقار في ${property.location}.`,
      url: `${siteUrl}/properties/${params.id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: `عقار بسعر ${property.price.toLocaleString()} ج.م في ${
        property.location
      }.`,
    },
  };
}

export default async function PropertyDetails({ params }) {
  if (!params?.id) {
    return notFound();
  }
  await connectDB();

  let property;
  let isLoading = true;
  let error = null;

  try {
    property = await Property.findById(params.id)
      .select("title price area type location images description createdAt")
      .lean();

    if (!property) {
      return notFound();
    }

    isLoading = false;
  } catch (err) {
    error = err.message;
    isLoading = false;
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span>⚠️ حدث خطأ في تحميل بيانات العقار: {error}</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
          <p className="mt-4 text-lg font-medium text-gray-600">
            جاري تحميل بيانات العقار...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        {property.title}
      </h1>

      {/* استبدال سلايدر الصور بالمكون الجديد */}
      <PropertyImageSlider images={property.images} title={property.title} />

      {/* تفاصيل العقار */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* القسم الأيسر - المعلومات الأساسية */}
        <div className="lg:col-span-2 space-y-6">
          {/* بطاقة التفاصيل */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-600">
              <Home className="text-blue-500" size={20} />
              تفاصيل العقار
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="text-green-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">السعر</p>
                  <p className="font-medium text-lg">
                    {property.price.toLocaleString()} ج.م
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Ruler className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">المساحة</p>
                  <p className="font-medium text-lg">{property.area} م²</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Type className="text-purple-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">النوع</p>
                  <p className="font-medium text-lg">{property.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="text-red-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">الموقع</p>
                  <p className="font-medium text-lg">{property.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* الوصف */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              وصف العقار
            </h2>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: property.description }}
            />
          </div>
        </div>

        {/* القسم الأيمن - نموذج الاتصال */}
        <div className="sticky top-4 h-fit">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              طلب استفسار
            </h2>
            <RequestForm propertyId={property._id.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
}
