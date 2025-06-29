import MyRequestsPage from "./myReqClient";

export const metadata = {
  title: "طلباتي | عقاراتــك",
  description: "استعرض طلباتك المرسلة وتابع حالتها وقم بالتعديل أو الحذف بسهولة.",
  keywords: ["طلبات", "طلباتي", "إدارة الطلبات", "عقارات", "مراسلات", "الوحدات العقارية"],
  openGraph: {
    title: "طلباتي | نظام إدارة العقارات",
    description: "تابع كل الطلبات التي قمت بإرسالها، وعدّل بياناتك بسهولة.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-requests`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "طلباتي | نظام عقاراتــك",
    description: "تحكم في جميع الطلبات الخاصة بك داخل النظام العقاري.",
  },
};

export default function MyRequestsPageMeta() {
  return <MyRequestsPage />;
}
