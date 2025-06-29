import RegisterPage from "./registerClient";

export const metadata = {
  title: "عقاراتــك | إنشاء حساب جديد",
  description: "قم بإنشاء حساب جديد للبدء في استخدام نظام إدارة العقارات.",
  keywords: [
    "تسجيل",
    "إنشاء حساب",
    "مستخدم جديد",
    "تسجيل مستخدم",
    "نظام عقارات",
  ],
  openGraph: {
    title: "عقاراتــك | تسجيل مستخدم جديد",
    description: "أنشئ حسابك الخاص وابدأ في إدارة عقاراتك بكل سهولة.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "عقاراتــك | إنشاء حساب",
    description: "ابدأ رحلتك في إدارة العقارات عبر إنشاء حسابك الآن.",
  },
};

export default function RegisterPageMeta() {
  return <RegisterPage />;
}
