import LoginPage from "./loginClient";

export const metadata = {
  title: "عقاراتــك | تسجيل الدخول",
  description: "تسجيل الدخول إلى حسابك في موقعنا وإدارة عقاراتك بكل سهولة.",
  keywords: [
    "تسجيل الدخول",
    "لوحة التحكم",
    "إدارة العقارات",
    "نظام عقارات",
    "login",
  ],
  openGraph: {
    title: "عقاراتــك | تسجيل الدخول",
    description: "أدخل بياناتك لتسجيل الدخول وإدارة حسابك.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "عقاراتــك | تسجيل الدخول",
    description: "تسجيل الدخول إلى حسابك في نظام إدارة العقارات.",
  },
};

export default function LoginPageMeta() {
  return <LoginPage />;
}
