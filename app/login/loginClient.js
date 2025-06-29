"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, UserPlus, Key, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });


  const router = useRouter();
  const { fetchUser } = useUser();

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        await Swal.fire({
          title: "تم بنجاح!",
          text: "تم تسجيل الدخول بنجاح",
          icon: "success",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#3b82f6",
          timer: 2000,
          timerProgressBar: true,
        });
        if (data.success) {
          await fetchUser();
          router.push("/");
        }
      } else {
        await Swal.fire({
          title: "خطأ!",
          text: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          icon: "error",
          confirmButtonText: "حسناً",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error(err);
      await Swal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء تسجيل الدخول",
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
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">تسجيل الدخول</h2>
        </div>

        {/* Form Section */}
        <div className="p-8">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input input-bordered w-full pl-10"
                  placeholder="********"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="label cursor-pointer flex items-center gap-2">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className="label-text">تذكرني</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <Key className="w-4 h-4" />
                نسيت كلمة المرور؟
              </Link>
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
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                </span>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="divider">أو</div>
          <div className="text-center">
            <Link
              href="/register"
              className="btn btn-outline w-full flex items-center gap-2 border-primary text-primary"
            >
              <UserPlus className="w-5 h-5" />
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
