"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Unauthorized() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">غير مصرح بالوصول</h2>
        <p className="text-gray-600 mb-6">
          ليست لديك الصلاحيات الكافية للوصول إلى هذه الصفحة
        </p>
        <p className="text-sm text-gray-500">
          سيتم تحويلك إلى الصفحة الرئيسية تلقائياً خلال 5 ثواني
        </p>
      </div>
    </div>
  );
}