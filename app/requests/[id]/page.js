import { notFound } from "next/navigation";
import { User, Mail, Phone, Calendar, Home, ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  // جلب بيانات الطلب لاستخدام اسم العقار في السيو
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/${params.id}`,
    { cache: "no-store" }
  );
  
  if (!res.ok) {
    return {
      title: "تفاصيل الطلب | نظام إدارة العقارات",
      description: "عرض تفاصيل طلب التواصل مع العميل.",
    };
  }

  const { success, data: req } = await res.json();
  const propertyName = req?.propertyId?.title || "طلب عام";

  return {
    title: `طلب ${propertyName} | نظام إدارة العقارات`,
    description: `تفاصيل طلب العميل ${req?.name} حول العقار ${propertyName}`,
    openGraph: {
      title: `طلب ${propertyName}`,
      description: `عرض تفاصيل الطلب المتعلق بالعقار ${propertyName}`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/requests/${params.id}`,
    },
  };
}

export default async function RequestDetailsPage({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/requests/${params.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();

  const { success, data: req } = await res.json();
  if (!success || !req) return notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">تفاصيل الطلب</h1>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <DetailCardItem
              icon={<User className="w-5 h-5" />}
              label="الاسم"
              value={req.name}
            />
            
            <DetailCardItem
              icon={<Phone className="w-5 h-5" />}
              label="رقم الواتساب"
              value={
                <a
                  href={`https://wa.me/${req.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {req.whatsapp}
                </a>
              }
            />
            
            <DetailCardItem
              icon={<Mail className="w-5 h-5" />}
              label="البريد الإلكتروني"
              value={
                <a
                  href={`mailto:${req.email}`}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {req.email}
                </a>
              }
            />
            
            <DetailCardItem
              icon={<Home className="w-5 h-5" />}
              label="العقار المرتبط"
              value={
                req.propertyId ? (
                  <a
                    href={`/properties/${req.propertyId._id}`}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {req.propertyId.title}
                  </a>
                ) : (
                  <span className="text-gray-500">غير مرتبط بعقار</span>
                )
              }
            />
            
            <DetailCardItem
              icon={<ClipboardList className="w-5 h-5" />}
              label="الرسالة"
              value={
                req.message || (
                  <span className="text-gray-500">لا توجد رسالة</span>
                )
              }
            />
            
            <DetailCardItem
              icon={<Calendar className="w-5 h-5" />}
              label="تاريخ الإرسال"
              value={new Date(req.createdAt).toLocaleString("ar-EG")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCardItem({ icon, label, value }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">{icon}</div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <div className="mt-1 text-gray-900">{value}</div>
      </div>
    </div>
  );
}