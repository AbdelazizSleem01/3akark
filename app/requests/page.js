import {
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  User,
  Home,
  ClipboardList,
} from "lucide-react";
import DeleteRequestButton from "../components/DeleteRequestButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "قائمة الطلبات | نظام إدارة العقارات",
  description: "عرض جميع طلبات التواصل والاستفسارات المرتبطة بالعقارات.",
  keywords: ["طلبات العقارات", "إدارة الطلبات", "استفسارات", "نظام عقارات"],
  openGraph: {
    title: "قائمة الطلبات",
    description: "صفحة تعرض جميع الطلبات الخاصة بالعقارات.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/requests`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "قائمة الطلبات | نظام العقارات",
    description: "تابع استفسارات وطلبات العملاء المرتبطة بالعقارات.",
  },
};

export default async function RequestsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/requests`, {
    cache: "no-store",
  });
  const { success, data: requests } = await res.json();

  if (!success) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="alert alert-error">
          <span>حدث خطأ أثناء تحميل الطلبات</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ClipboardList className="w-8 h-8" />
          قائمة الطلبات
        </h1>
      </div>

      {requests.length === 0 ? (
        <div className="alert alert-info">
          <span>لا توجد طلبات متاحة حالياً</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-right py-3 px-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>الاسم</span>
                    </div>
                  </th>
                  <th className="text-right py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>الهاتف</span>
                    </div>
                  </th>
                  <th className="text-right py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>البريد الإلكتروني</span>
                    </div>
                  </th>
                  <th className="text-right py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      <span>العقار</span>
                    </div>
                  </th>
                  <th className="text-right py-3 px-4">
                    <div className="flex items-center gap-1">
                      <ClipboardList className="w-4 h-4" />
                      <span>الرسالة</span>
                    </div>
                  </th>
                  <th className="text-right py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>تاريخ الإنشاء</span>
                    </div>
                  </th>
                  <th className="text-right py-3 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{req.name}</td>
                    <td className="py-3 px-4">
                      <a
                        href={`https://wa.me/${req.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-4 h-4" />
                        {req.whatsapp}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`mailto:${req.email}`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4" />
                        {req.email}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      {req.propertyId ? (
                        <a
                          href={`/properties/${req.propertyId._id}`}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Home className="w-4 h-4" />
                          {req.propertyId.title}
                        </a>
                      ) : (
                        <span className="text-gray-500">غير معروف</span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="truncate" title={req.message}>
                        {req.message || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4" dir="ltr">
                      {new Date(req.createdAt).toLocaleString("ar-EG")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end">
                        <DeleteRequestButton requestId={req._id} />
                        <a
                          href={`/requests/${req._id}`}
                          className="btn btn-sm btn-outline btn-info flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>عرض</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}