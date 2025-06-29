"use client";
import { useState, useEffect } from "react";
import {
  Trash2,
  Edit,
  Home,
  User,
  MessageSquare,
  Phone,
  Calendar,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [editingRequest, setEditingRequest] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    message: "",
  });

  const fetchUserEmail = async () => {
    try {
      const res = await axios.get("/api/users/current");
      if (res.data?.email) {
        setUserEmail(res.data.email);
      } else {
        throw new Error("Email not found");
      }
    } catch (err) {
      Swal.fire("خطأ", "تعذر الحصول على معلومات المستخدم", "error");
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.post("/api/requests/user", {
        email: userEmail,
      });
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (userEmail) fetchRequests();
  }, [userEmail]);

  const openEditModal = (req) => {
    setEditingRequest(req);
    setFormData({
      name: req.name,
      whatsapp: req.whatsapp,
      message: req.message,
    });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const res = await axios.put(`/api/requests/${editingRequest._id}`, {
        ...formData,
        email: userEmail,
      });
      if (res.data.success) {
        await fetchRequests(); // 👈 هنا التحديث
        Swal.fire("تم التعديل", "تم حفظ التغييرات بنجاح", "success");
        setEditingRequest(null);
      }
    } catch (err) {
      Swal.fire("خطأ", "حدث خطأ أثناء الحفظ", "error");
    }
  };

  const deleteRequest = async (id) => {
    const confirm = await Swal.fire({
      title: "هل تريد حذف هذا الطلب؟",
      text: "لن يمكنك التراجع لاحقًا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/requests/${id}`);
        setRequests((prev) => prev.filter((r) => r._id !== id));
        Swal.fire("تم الحذف!", "تم حذف الطلب بنجاح.", "success");
      } catch (err) {
        Swal.fire("خطأ", "حدث خطأ أثناء الحذف", "error");
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold">طلباتك</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen gap-4 bg-base-100">
          <progress className="progress progress-primary w-56"></progress>
          <p className="text-lg font-medium text-primary animate-pulse">
            جاري التحميل، الرجاء الانتظار...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="alert alert-info shadow-lg">
          <span>لا توجد طلبات مقدمة</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right">
                    <div className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      العقار
                    </div>
                  </th>
                  <th className="text-right">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      الاسم
                    </div>
                  </th>
                  <th className="text-right">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      رقم الواتساب
                    </div>
                  </th>
                  <th className="text-right">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      الرسالة
                    </div>
                  </th>
                  <th className="text-right">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      التاريخ
                    </div>
                  </th>
                  <th className="text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td>
                      {r.propertyId ? (
                        <a
                          href={`/properties/${r.propertyId._id}`}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Home className="w-4 h-4" />
                          {r.propertyId.title}
                        </a>
                      ) : (
                        "غير محدد"
                      )}
                    </td>
                    <td>{r.name}</td>
                    <td>
                      {r.whatsapp ? (
                        <a
                          href={`https://wa.me/${r.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-4 h-4" />
                          {r.whatsapp}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="max-w-xs truncate">{r.message || "-"}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString("ar-EG")}</td>
                    <td>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEditModal(r)}
                          className="btn btn-sm btn-warning flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          تعديل
                        </button>
                        <button
                          className="btn btn-sm btn-error flex items-center gap-1"
                          onClick={() => deleteRequest(r._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* نافذة التعديل */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 bg-black/90 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Edit className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-blue-600">تعديل الطلب</h2>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <User className="w-4 h-4" />
                    الاسم
                  </span>
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  placeholder="الاسم"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    رقم الواتساب
                  </span>
                </label>
                <input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  placeholder="رقم الواتساب"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    الرسالة
                  </span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleEditChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="الرسالة"
                  rows={4}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn btn-ghost"
                onClick={() => setEditingRequest(null)}
              >
                إلغاء
              </button>
              <button
                className="btn btn-primary flex items-center gap-1"
                onClick={handleEditSave}
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
