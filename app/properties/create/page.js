import CreatePropertyPage from "./CreatePropertyClient";

export const metadata = {
  title: "إضافة أو تعديل عقار | عقاراتـك",
  description:
    "أضف أو عدل بيانات العقارات بسهولة مع واجهة مستخدم مرنة وداعمة للغة العربية.",
  keywords: [
    "عقار",
    "إضافة عقار",
    "تعديل عقار",
    "نظام إدارة",
    "شقق",
    "عقارات للبيع",
  ],
  openGraph: {
    title: "إضافة عقار جديد",
    description: "قم بإضافة أو تعديل العقارات بسهولة.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/properties/create`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "إضافة عقار | نظام العقارات",
    description: "صفحة إدارة العقارات - الإضافة أو التعديل.",
  },
};



export default function CreateProperty() {
  return <CreatePropertyPage />;
}
