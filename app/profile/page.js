import ProfilePage from "./profileClient";

export const metadata = {
  title: "الملف الشخصي | نظام إدارة العقارات",
  description:
    "قم بتعديل بياناتك الشخصية مثل الاسم، البريد الإلكتروني، وكلمة المرور.",
  keywords: [
    "الملف الشخصي",
    "تعديل الحساب",
    "تغيير كلمة المرور",
    "تحديث البيانات",
    "نظام عقارات",
  ],
  openGraph: {
    title: "الملف الشخصي",
    description: "تحديث معلومات المستخدم الشخصية داخل نظام إدارة العقارات.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "الملف الشخصي | نظام إدارة العقارات",
    description: "صفحة تعديل بيانات الحساب الشخصي وكلمة المرور.",
  },
};

export default function ProfilePageMeta() {
  return <ProfilePage />;
}
