import UsersPage from "./UsersClient";

export const metadata = {
  title: "إدارة المستخدمين | نظام إدارة العقارات",
  description: "صفحة إدارة المستخدمين وتعديل الصلاحيات والأدوار.",
  keywords: [
    "إدارة المستخدمين",
    "صلاحيات",
    "أدوار",
    "لوحة تحكم",
    "نظام عقارات",
  ],
  openGraph: {
    title: "إدارة المستخدمين",
    description: "تحكم في صلاحيات وأدوار المستخدمين في النظام.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "إدارة المستخدمين | لوحة تحكم العقارات",
    description: "صفحة التحكم الكاملة بالمستخدمين وصلاحياتهم.",
  },
};

export default function UsersPageMeta() {
  return <UsersPage />;
}
