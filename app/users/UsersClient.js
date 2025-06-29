"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Key,
  Edit,
  Trash2,
  Eye,
  Plus,
  Save,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [swalInstance, setSwalInstance] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handlePermissionChange = async (userId, permission) => {
    const updatedUsers = users.map((user) => {
      if (user._id === userId) {
        user.permissions[permission] = !user.permissions[permission];
      }
      return user;
    });
    setUsers(updatedUsers);

    try {
      setIsSaving(true);
      const instance = MySwal.fire({
        title: "جاري الحفظ...",
        text: "يرجى الانتظار حتى يتم حفظ التغييرات.",
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
        },
      });
      setSwalInstance(instance);

      await axios.put("/api/users/" + userId, {
        permissions: updatedUsers.find((u) => u._id === userId).permissions,
      });

      await instance.close();
    } catch (error) {
      console.error("Error updating permissions:", error);
      await MySwal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء حفظ التغييرات",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    } finally {
      setIsSaving(false);
      setSwalInstance(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const updatedUsers = users.map((user) => {
      if (user._id === userId) {
        user.role = newRole;
      }
      return user;
    });
    setUsers(updatedUsers);

    try {
      setIsSaving(true);
      const instance = MySwal.fire({
        title: "جاري الحفظ...",
        text: "يرجى الانتظار حتى يتم حفظ التغييرات.",
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
        },
      });
      setSwalInstance(instance);

      await axios.put("/api/users/" + userId, {
        role: newRole,
      });

      await instance.close();
    } catch (error) {
      console.error("Error updating role:", error);
      await MySwal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء حفظ التغييرات",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    } finally {
      setIsSaving(false);
      setSwalInstance(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await MySwal.fire({
      title: "هل أنت متأكد؟",
      text: "لا يمكن التراجع عن حذف المستخدم!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف!",
      cancelButtonText: "إلغاء",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/users/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        await MySwal.fire({
          title: "تم الحذف!",
          text: "تم حذف المستخدم بنجاح.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        await MySwal.fire({
          title: "خطأ!",
          text: "حدث خطأ أثناء محاولة حذف المستخدم",
          icon: "error",
          confirmButtonText: "حسناً",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const refreshUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error refreshing users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="badge badge-primary gap-1">
            <ShieldCheck className="w-3 h-3" /> مدير
          </span>
        );
      case "moderator":
        return (
          <span className="badge badge-secondary gap-1">
            <Shield className="w-3 h-3" /> مشرف
          </span>
        );
      default:
        return (
          <span className="badge badge-ghost gap-1">
            <ShieldOff className="w-3 h-3" /> مستخدم
          </span>
        );
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen gap-2">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="ml-4">جاري تحميل المستخدمين...</span>
      </div>
    );
  }

  if (users.length === 0 && !isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="alert alert-info">
          <span>لا توجد مستخدمين متاحين حالياً</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Key className="w-6 h-6" />
          إدارة المستخدمين
        </h1>
        <button
          onClick={refreshUsers}
          className="btn btn-outline btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          تحديث
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-72 gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>{" "}
          جاري تحميل المستخدمين...
        </div>
      ) : (
        <div className="bg-base-100 rounded-box shadow-lg border border-base-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-200">
                <tr>
                  <th className="text-right">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      الاسم
                    </div>
                  </th>
                  <th className="text-right">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني
                    </div>
                  </th>
                  <th className="text-right">
                    <div className="flex items-center gap-1">
                      <Key className="w-4 h-4" />
                      الدور
                    </div>
                  </th>
                  <th className="text-right">
                    <div className="flex items-center gap-1">
                      <Key className="w-4 h-4" />
                      الصلاحيات
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8">
                            <span className="flex items-center justify-center mt-1">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="dropdown dropdown-left">
                          <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-xs btn-ghost"
                          >
                            <Edit className="w-4 h-4" />
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
                          >
                            <li>
                              <button
                                onClick={() =>
                                  handleRoleChange(user._id, "admin")
                                }
                              >
                                <ShieldCheck className="w-3 h-3" />
                                تعيين كمدير
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleRoleChange(user._id, "moderator")
                                }
                              >
                                <Shield className="w-3 h-3" />
                                تعيين كمشرف
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleRoleChange(user._id, "user")
                                }
                              >
                                <ShieldOff className="w-3 h-3" />
                                مستخدم عادي
                              </button>
                            </li>
                          </ul>
                        </div>
                        {getRoleBadge(user.role || "user")}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <label className="cursor-pointer label border border-blue-600 rounded-lg p-2">
                          <div className="flex items-center gap-1">
                            <Plus className="w-4 h-4" />
                            <span className="label-text">إنشاء</span>
                          </div>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary toggle-sm"
                            checked={user.permissions.create}
                            onChange={() =>
                              handlePermissionChange(user._id, "create")
                            }
                          />
                        </label>

                        <label className="cursor-pointer label border border-blue-600 rounded-lg p-2">
                          <div className="flex items-center gap-1">
                            <Edit className="w-4 h-4" />
                            <span className="label-text">تعديل</span>
                          </div>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary toggle-sm"
                            checked={user.permissions.edit}
                            onChange={() =>
                              handlePermissionChange(user._id, "edit")
                            }
                          />
                        </label>

                        <label className="cursor-pointer label border border-blue-600 rounded-lg p-2">
                          <div className="flex items-center gap-1">
                            <Trash2 className="w-4 h-4" />
                            <span className="label-text">حذف</span>
                          </div>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary toggle-sm"
                            checked={user.permissions.delete}
                            onChange={() =>
                              handlePermissionChange(user._id, "delete")
                            }
                          />
                        </label>

                        <label className="cursor-pointer label border border-blue-600 rounded-lg p-2">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span className="label-text">عرض</span>
                          </div>
                          <input
                            type="checkbox"
                            className="toggle toggle-primary toggle-sm"
                            checked={user.permissions.view}
                            onChange={() =>
                              handlePermissionChange(user._id, "view")
                            }
                          />
                        </label>
                        <label className="cursor-pointer label ">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="btn btn-sm btn-outline btn-error h-10 rounded-lg"
                            disabled={isSaving}
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف
                          </button>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
