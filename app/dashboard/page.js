// app/dashboard/page.js

import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "لوحة تحكم إدارة العقارات | إحصائيات ومخططات",
  description:
    "لوحة التحكم الشاملة لمتابعة إحصائيات العقارات والطلبات والمستخدمين مع عرض مرئي للبيانات عبر مخططات تفاعلية",
  keywords:
    "لوحة تحكم, إحصائيات عقارات, مخططات بيانية, إدارة عقارات, تتبع الطلبات",
  robots: "noindex, nofollow",
  openGraph: {
    title: "لوحة تحكم إدارة العقارات",
    description:
      "لوحة التحكم الشاملة لمتابعة إحصائيات العقارات والطلبات والمستخدمين",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "لوحة تحكم إدارة العقارات",
    description:
      "لوحة التحكم الشاملة لمتابعة إحصائيات العقارات والطلبات والمستخدمين",
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
