"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Building,
  Users,
  ClipboardList,
  PlusCircle,
  LogOut,
  UserCog,
  Shield,
  ShieldCheck,
  Bell,
  BellDot,
  ChartColumn,
  ListOrdered,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { removeToken } from "@/utils/auth";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const MySwal = withReactContent(Swal);

const NotificationsList = dynamic(() => import("./NotificationsList"), {
  ssr: false,
  loading: () => (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function Sidebar() {
  const router = useRouter();
  const { user } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/notifications/unread-count");
        const data = await res.json();
        setUnreadCount(data.count);
      } catch (error) {
        console.error("Failed to fetch notifications count:", error);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: "تأكيد الخروج",
      text: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "نعم، سجل خروج",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        await fetch("/api/logout", { method: "POST" });

        MySwal.fire({
          title: "تم تسجيل الخروج!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          window.location.href = "/login";
        });
      } catch (err) {
        console.error("Logout error:", err);
        Swal.fire("خطأ", "فشل تسجيل الخروج", "error");
      }
    }
  };

  const getRoleBadge = () => {
    if (!user?.role) return null;

    switch (user.role) {
      case "admin":
        return (
          <div className="badge badge-primary gap-1 py-2 px-2">
            <ShieldCheck className="w-4 h-4" />
            <p className="pb-1">مدير النظام</p>
          </div>
        );
      case "moderator":
        return (
          <span className="badge badge-secondary gap-1 py-1 px-2">
            <Shield className="w-4 h-4" />
            <p className="pb-1">مشرف</p>
          </span>
        );
      default:
        return (
          <span className="badge badge-ghost gap-1 py-1 px-2">
            <UserCog className="w-4 h-4" />
            <p className="pb-1">مستخدم</p>
          </span>
        );
    }
  };

  return (
    <>
      <aside className="fixed h-screen w-16 hover:w-64 transition-all overflow-scroll duration-300 bg-gradient-to-b from-blue-600 to-blue-800 shadow-xl group z-40">
        <nav className="flex flex-col h-full py-8 space-y-2">
          {/* Header */}
          <div className="px-4 hidden group-hover:block mb-4">
            <h2 className="text-white text-xl font-bold text-center">
              لوحة التحكم - عقاراتك
            </h2>
          </div>

          {/* User Info */}
          {user && (
            <div className="flex flex-col items-center gap-2 px-4 hidden group-hover:flex mb-4">
              <div className="bg-white text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">{user.name}</div>
                <div className="text-gray-200 text-xs mb-1">{user.email}</div>
                {getRoleBadge()}
              </div>
            </div>
          )}
          <div className="border-t border-dashed border-gray-100 my-1 px-2"></div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-1 px-2">
            <Link
              href="/"
              className="flex items-center gap-4 px-4 py-3 text-white hover:bg-blue-500/50 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 min-w-[20px]" />
              <span className="hidden group-hover:inline text-lg">
                الرئيسية
              </span>
            </Link>
            {user?.role === "admin" && (
              <button
                onClick={toggleNotifications}
                className="flex items-center gap-4 cursor-pointer w-full px-4 py-3 text-white hover:bg-blue-500/50 rounded-lg transition-colors relative"
              >
                {unreadCount > 0 ? (
                  <>
                    <BellDot className="w-5 h-5 min-w-[20px]" />
                    <span className="hidden group-hover:inline text-lg">
                      الإشعارات
                    </span>
                    <span className="absolute right-0 top-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5 min-w-[20px]" />
                    <span className="hidden group-hover:inline text-lg">
                      الإشعارات
                    </span>
                  </>
                )}
              </button>
            )}
            {(user?.role === "admin" || user?.role === "moderator") && (
              <>
                <Link
                  href="/properties/create"
                  className="flex items-center gap-4 px-4 py-3 text-white hover:bg-blue-500/50 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-5 h-5 min-w-[20px]" />
                  <span className="hidden group-hover:inline text-lg">
                    إضافة عقار
                  </span>
                </Link>
                <Link
                  href="/requests"
                  className="flex items-center gap-4 px-4 py-3 text-white hover:bg-blue-500/50 rounded-lg transition-colors"
                >
                  <ClipboardList className="w-5 h-5 min-w-[20px]" />
                  <span className="hidden group-hover:inline text-lg">
                    الطلبات
                  </span>
                </Link>

                {user?.role === "admin" && (
                  <>
                    <Link
                      href="/users"
                      className="flex items-center gap-4 px-4 py-3 text-white hover:bg-blue-500/50 rounded-lg transition-colors"
                    >
                      <Users className="w-5 h-5 min-w-[20px]" />
                      <span className="hidden group-hover:inline text-lg">
                        المستخدمين
                      </span>
                    </Link>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-4 px-4 py-3 text-white hover:bg-blue-500/50 rounded-lg transition-colors"
                    >
                      <ChartColumn className="w-5 h-5 min-w-[20px]" />
                      <span className="hidden group-hover:inline text-lg">
                        الاحصائيات
                      </span>
                    </Link>
                  </>
                )}
              </>
            )}
            <Link
              href="/properties"
              className="flex items-center gap-4 px-4 py-3 text-white hover:bg-blue-500/50 rounded-lg transition-colors"
            >
              <Building className="w-5 h-5 min-w-[20px]" />
              <span className="hidden group-hover:inline text-lg">
                العقارات
              </span>
            </Link>
            <Link
              href="/my-requests"
              className="flex items-center gap-4 px-4 py-3 text-white hover:bg-blue-500/50 rounded-lg transition-colors"
            >
              <ListOrdered className="w-5 h-5 min-w-[20px]" />
              <span className="hidden group-hover:inline text-lg">طلباتي</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-4 px-4 py-3 text-white hover:bg-blue-500/50 rounded-lg transition-colors"
            >
              <UserCog className="w-5 h-5 min-w-[20px]" />
              <span className="hidden group-hover:inline text-lg">
                الملف الشخصي
              </span>
            </Link>
          </div>

          <div className="border-t border-dashed border-gray-100 my-1 px-2"></div>

          <div className="mt-auto px-2 space-y-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 cursor-pointer w-full px-4 py-3 text-white hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 min-w-[20px]" />
              <span className="hidden group-hover:inline text-lg">
                تسجيل الخروج
              </span>
            </button>
          </div>
        </nav>
      </aside>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full z-50"
          >
            <NotificationsList
              onClose={() => setShowNotifications(false)}
              onMarkAsRead={() =>
                setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
