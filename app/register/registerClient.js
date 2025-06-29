"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, LogIn, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      await Swal.fire({
        title: "خطأ!",
        text: "كلمتا المرور غير متطابقتين",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        await Swal.fire({
          title: "تم بنجاح!",
          text: data.message || "تم إنشاء الحساب بنجاح",
          icon: "success",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#3b82f6",
          timer: 2000,
          timerProgressBar: true,
        });
        router.push("/login");
      } else {
        await Swal.fire({
          title: "خطأ!",
          text: data.message || "فشل في إنشاء الحساب",
          icon: "error",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error(err);
      await Swal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء إنشاء الحساب",
        icon: "error",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 p-6 text-center">
          <div className="flex justify-center mb-3">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">إنشاء حساب جديد</h2>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <User className="w-5 h-5" />
                  الاسم الكامل
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full pl-10"
                  placeholder="أدخل اسمك الكامل"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full pl-10"
                  placeholder="example@domain.com"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  كلمة المرور
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="input input-bordered w-full pl-10"
                  placeholder="6 أحرف على الأقل"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
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
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="input input-bordered w-full pl-10"
                  placeholder="أعد إدخال كلمة المرور"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>{" "}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full mt-6"
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <span className="flex items-center gap-2">إنشاء حساب</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="divider">أو</div>
          <div className="text-center">
            <Link
              href="/login"
              className="btn btn-outline w-full flex items-center gap-2 border-primary text-primary"
            >
              <LogIn className="w-5 h-5" />
              لديك حساب بالفعل؟ سجل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
