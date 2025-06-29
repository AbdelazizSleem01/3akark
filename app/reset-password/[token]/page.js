"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { Lock, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // title
  document.title = "تعيين كلمة مرور جديدة";
  

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      Swal.fire({
        title: "خطأ",
        text: "كلمتا المرور غير متطابقتين",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/reset-password", { token, password });
      if (res.data.success) {
        await Swal.fire({
          title: "تم بنجاح!",
          text: "تم تغيير كلمة المرور بنجاح",
          icon: "success",
          confirmButtonColor: "#3b82f6",
          timer: 2000,
          timerProgressBar: true,
        });
        router.push("/login");
      }
    } catch (err) {
      Swal.fire({
        title: "خطأ",
        text: err.response?.data?.message || "حدث خطأ أثناء التغيير",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 p-6 text-center">
          <div className="flex justify-center mb-3">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">تعيين كلمة مرور جديدة</h1>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleReset} className="space-y-6">
            {/* New Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  كلمة المرور الجديدة
                </span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                  className="input input-bordered w-full pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  تأكيد كلمة المرور
                </span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="أعد إدخال كلمة المرور"
                  className="input input-bordered w-full pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <span className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5" />
                  حفظ كلمة المرور الجديدة
                </span>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة إلى صفحة تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}