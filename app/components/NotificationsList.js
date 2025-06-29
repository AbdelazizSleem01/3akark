"use client";
import { useEffect, useState } from "react";
import { Bell, BellDot, X, Loader2, Trash2, Check, Mail } from "lucide-react";
import Swal from "sweetalert2";

export default function NotificationsList({ onClose, onMarkAsRead }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/notifications");
        if (!response.ok) {
          throw new Error("فشل في جلب الإشعارات");
        }

        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("فشل في تحديث حالة الإشعار");
      }

      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
      onMarkAsRead();
    } catch (err) {
      console.error("Error marking notification as read:", err);
      Swal.fire({
        title: "خطأ",
        text: "حدث خطأ أثناء محاولة تحديث الإشعار",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("فشل في تحديث جميع الإشعارات");
      }

      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      onMarkAsRead();

      Swal.fire({
        title: "تمت العملية",
        text: "تم تعليم جميع الإشعارات كمقروءة",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      Swal.fire({
        title: "خطأ",
        text: "حدث خطأ أثناء محاولة تحديث الإشعارات",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    }
  };

  const deleteNotification = async (id) => {
    const confirm = await Swal.fire({
      title: "تأكيد الحذف",
      text: "هل أنت متأكد من حذف هذا الإشعار؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#ef4444",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/notifications/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setNotifications(notifications.filter((n) => n._id !== id));
          if (!notifications.find((n) => n._id === id)?.isRead) {
            setUnreadCount((prev) => prev - 1);
          }
          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف الإشعار بنجاح",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        console.error("Error deleting notification:", err);
        Swal.fire({
          title: "خطأ",
          text: "حدث خطأ أثناء حذف الإشعار",
          icon: "error",
          confirmButtonText: "حسناً",
        });
      }
    }
  };

  const deleteAllNotifications = async () => {
    const confirm = await Swal.fire({
      title: "تأكيد الحذف",
      text: "هل تريد حذف جميع الإشعارات؟ لا يمكن التراجع عن هذا الإجراء",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف الكل",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#ef4444",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/notifications`, {
          method: "DELETE",
        });
        if (res.ok) {
          setNotifications([]);
          setUnreadCount(0);
          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف جميع الإشعارات بنجاح",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        console.error("Error deleting all notifications:", err);
        Swal.fire({
          title: "خطأ",
          text: "حدث خطأ أثناء حذف الإشعارات",
          icon: "error",
          confirmButtonText: "حسناً",
        });
      }
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div className="flex items-center">
          <BellDot className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            الإشعارات
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full mx-2">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-700 border p-1 rounded-full cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Actions Bar */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div className="flex items-center justify-between w-full">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center text-sm cursor-pointer text-blue-600 hover:text-blue-800 px-3 py-1 rounded bg-blue-50 hover:bg-blue-100"
            >
              <Check className="w-4 h-4 mr-1" />
              تعليم الكل كمقروء
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={deleteAllNotifications}
              className="flex items-center text-sm cursor-pointer text-red-600 hover:text-red-800 px-3 py-1 rounded bg-red-50 hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              حذف الكل
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">جاري تحميل الإشعارات...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-600 p-4 text-center">
            <X className="w-12 h-12 mb-4" />
            <p className="font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
            <Mail className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg">لا توجد إشعارات</p>
            <p className="text-sm mt-1 text-gray-400">
              سيظهر هنا أي إشعارات جديدة تتلقاها
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !n.isRead ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between">
                  <div
                    className="flex items-start"
                    onClick={() => markAsRead(n._id)}
                  >
                    <div
                      className={`flex-shrink-0 h-3 w-3 rounded-full mt-1.5 mx-2 ${
                        !n.isRead ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-gray-900">
                          {n.performedBy?.name || "النظام"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {n.message || `${n.action} على ${n.entity}`}
                      </p>
                      <div className="text-xs text-gray-500 my-2 mx-auto">
                        ( {new Date(n.createdAt).toLocaleString("ar-EG")} )
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center border border-2 border-gray-400 hover:border-red-500 text-gray-400 hover:text-red-500  p-1 rounded-full w-8 h-8 cursor-pointer">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n._id);
                      }}
                      className=" cursor-pointer"
                      aria-label="حذف الإشعار"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
