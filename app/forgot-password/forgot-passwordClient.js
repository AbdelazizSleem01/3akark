"use client";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Mail, Key, ArrowLeftCircleIcon } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/forgot-password", { email });
      if (res.data.success) {
        Swal.fire({
          title: "تم الإرسال بنجاح",
          text: "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
        setEmail("");
      }
    } catch (err) {
      Swal.fire({
        title: "خطأ",
        text: err.response?.data?.message || "حدث خطأ أثناء الإرسال",
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
            <Key className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">استعادة كلمة المرور</h1>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <p className="text-gray-600 mb-6 text-center">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  البريد الإلكتروني
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="example@domain.com"
                  className="input input-bordered w-full pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  <Key className="w-5 h-5" />
                  إرسال رابط الإعادة
                </span>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-6  border border-primary rounded-md p-2">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 "
            >
              <ArrowLeftCircleIcon className="w-5 h-5" />
              العودة إلى صفحة تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
