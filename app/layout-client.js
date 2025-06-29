"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const hideSidebar = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const shouldHideSidebar = hideSidebar.some((path) =>
    pathname.startsWith(path)
  );

  useEffect(() => {
    // محاكاة تحميل البيانات أو الصفحة
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [pathname]); // يعتمد على تغيير المسار

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-lg font-medium text-primary">
            جاري التحميل، الرجاء الانتظار...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {!shouldHideSidebar && <Sidebar />}
      <main
        className={`flex-1 overflow-y-auto ${
          !shouldHideSidebar ? "md:mr-16" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
