import ForgotPasswordPage from "./forgot-passwordClient";

export const metadata = {
  title: "نسيت كلمة المرور | نظام إدارة العقارات",
  description:
    "استرجاع الوصول إلى حسابك عبر البريد الإلكتروني في حال نسيت كلمة المرور.",
  keywords: [
    "نسيت كلمة المرور",
    "استرجاع الحساب",
    "إعادة تعيين كلمة المرور",
    "نظام عقارات",
    "كلمة السر",
  ],
  openGraph: {
    title: "استرجاع كلمة المرور",
    description: "أدخل بريدك الإلكتروني لاستلام رابط إعادة تعيين كلمة المرور.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/forgot-password`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "نسيت كلمة المرور | نظام إدارة العقارات",
    description:
      "صفحة استرجاع كلمة المرور وإعادة تعيينها باستخدام البريد الإلكتروني.",
  },
};

export default function ForgotPasswordPageMeta() {
  return <ForgotPasswordPage />;
}
