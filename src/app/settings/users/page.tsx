"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ArrowRight,
  Home,
  UserPlus,
  Search,
  ShieldAlert,
  MoreVertical,
  Edit,
  Trash2,
  ShieldCheck,
  Briefcase,
  BadgeCheck,
  Lock,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Key,
  Mail,
  Phone,
  Calendar,
  Clock,
  Activity,
  Filter,
  ChevronDown,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Settings2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// ✅ مكون نافذة إضافة/تعديل موظف
const UserModal = ({ isOpen, onClose, user, mode, onSuccess }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    id: user?.id || "",
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
    status: user?.status || "نشط",
    password: "",
    showPassword: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || "",
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        status: user.status || "نشط",
        password: "",
        showPassword: false,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url =
        mode === "add" ? "/api/settings/users" : "/api/settings/users";
      const method = mode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "حدث خطأ في العملية");
      }
    } catch (err) {
      setError("فشل الاتصال بالسيرفر");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[95%] sm:max-w-md max-h-[85vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#C9A962]/20"
          >
            <div className="sticky top-0 bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white p-4 sm:p-5 rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black">
                  {mode === "add" ? "إضافة موظف جديد" : "تعديل بيانات الموظف"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-bold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-[#9A7B3C] uppercase mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#FDF8F2] border border-[#E8D5A3] rounded-xl px-3 py-2.5 text-sm font-bold focus:border-[#C9A962] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#9A7B3C] uppercase mb-1.5">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-[#FDF8F2] border border-[#E8D5A3] rounded-xl px-3 py-2.5 text-sm font-bold focus:border-[#C9A962] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#9A7B3C] uppercase mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[#FDF8F2] border border-[#E8D5A3] rounded-xl px-3 py-2.5 text-sm font-bold focus:border-[#C9A962] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#9A7B3C] uppercase mb-1.5">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-[#FDF8F2] border border-[#E8D5A3] rounded-xl px-3 py-2.5 text-sm font-bold focus:border-[#C9A962] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#9A7B3C] uppercase mb-1.5">
                  الدور الوظيفي
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full bg-[#FDF8F2] border border-[#E8D5A3] rounded-xl px-3 py-2.5 text-sm font-bold focus:border-[#C9A962] outline-none"
                  required
                >
                  <option value="">اختر الدور</option>
                  <option value="المدير العام">المدير العام</option>
                  <option value="كاشير مبيعات">كاشير مبيعات</option>
                  <option value="محاسب">محاسب</option>
                  <option value="أمين مستودع">أمين مستودع</option>
                </select>
              </div>

              {mode === "edit" && (
                <div>
                  <label className="block text-[10px] font-black text-[#9A7B3C] uppercase mb-1.5">
                    الحالة
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full bg-[#FDF8F2] border border-[#E8D5A3] rounded-xl px-3 py-2.5 text-sm font-bold focus:border-[#C9A962] outline-none"
                  >
                    <option value="نشط">نشط</option>
                    <option value="غير نشط">غير نشط</option>
                  </select>
                </div>
              )}

              {mode === "add" && (
                <div>
                  <label className="block text-[10px] font-black text-[#9A7B3C] uppercase mb-1.5">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={formData.showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full bg-[#FDF8F2] border border-[#E8D5A3] rounded-xl px-3 py-2.5 text-sm font-bold focus:border-[#C9A962] outline-none pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          showPassword: !formData.showPassword,
                        })
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {formData.showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : mode === "add" ? (
                    "إضافة"
                  ) : (
                    "حفظ التعديلات"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ✅ مكون نافذة تأكيد الحذف
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isDeleting,
}: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-sm bg-white rounded-2xl sm:rounded-3xl p-6 shadow-2xl border border-[#C9A962]/20"
          >
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-rose-600" />
              </div>
              <h3 className="text-lg font-black text-[#1A1612] mb-2">
                تأكيد الحذف
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                هل أنت متأكد من حذف الموظف "{user?.name}"؟
                <br />
                <span className="text-rose-500 text-xs font-bold">
                  هذا الإجراء لا يمكن التراجع عنه.
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm"
                >
                  إلغاء
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      جاري الحذف...
                    </>
                  ) : (
                    "تأكيد الحذف"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function UsersSettings() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ✅ جلب البيانات الحقيقية من API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/settings/users");
        const data = await response.json();
        if (!data.error) {
          setUsers(data);
        }
      } catch (error) {
        console.error("خطأ في جلب الموظفين:", error);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 w-10 h-10 text-[#C9A962]" />
          <p className="text-sm font-black text-[#1A1612]/50 uppercase tracking-widest">
            جاري تحميل البيانات...
          </p>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter((u) => u.status === "نشط").length;
  const inactiveUsers = users.filter((u) => u.status === "غير نشط").length;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && user.status === "نشط") ||
      (filterStatus === "inactive" && user.status === "غير نشط");

    return matchesSearch && matchesFilter;
  });

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/settings/users?id=${selectedUser.id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        refreshData();
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSuccess = () => {
    refreshData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] text-[#1A1612] selection:bg-[#C9A962]/20 selection:text-[#9A7B3C] pb-20">
      {/* نوافذ منبثقة */}
      <UserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mode="add"
        onSuccess={handleModalSuccess}
      />
      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        mode="edit"
        onSuccess={handleModalSuccess}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={selectedUser}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* شريط التنقل للجوال */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#E8D5A3]/30 px-3 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors">
                <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors">
                <Home size={18} />
              </button>
            </Link>
          </div>
          <h1 className="text-base font-black italic text-[#1A1612]">
            الموظفين
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 bg-[#C9A962] rounded-xl text-white shadow-md shadow-[#C9A962]/20"
          >
            <UserPlus size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* الترويسة الرئيسية */}
        <div className="mb-5 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start sm:items-center gap-3 sm:gap-4"
          >
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/settings">
                <button className="p-2 sm:p-2.5 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-[#E8D5A3]/50 shadow-sm">
                  <ArrowRight className="text-[#1A1612] w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
            </div>
            <div className="p-2.5 sm:p-3 md:p-4 bg-gradient-to-br from-[#F5EBE0] to-[#E8D5A3] rounded-xl sm:rounded-2xl shadow-sm border border-[#C9A962]/20">
              <Users
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#9A7B3C]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#1A1612]">
                إدارة الموظفين{" "}
                <span className="text-[#C9A962] font-light text-lg sm:text-xl md:text-2xl">
                  | الصلاحيات
                </span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#1A1612]/50 mt-1 sm:mt-2 flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]" />
                <span className="hidden sm:inline">
                  التحكم المطلق بمن يملك مفاتيح الدخول وأدوارهم في النظام.
                </span>
                <span className="sm:hidden">إدارة مفاتيح الدخول والأدوار</span>
              </p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsAddModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#9A7B3C] hover:from-[#1A1612] hover:to-[#2A241E] text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all duration-500 shadow-lg shadow-[#C9A962]/20"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            إضافة موظف جديد
          </motion.button>
        </div>

        {/* بطاقات إحصائية سريعة للجوال */}
        <div className="sm:hidden grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 border border-[#E8D5A3]/30">
            <p className="text-[10px] font-black text-gray-400 uppercase">
              الإجمالي
            </p>
            <p className="text-lg font-black text-[#1A1612]">{users.length}</p>
          </div>
          <div className="bg-emerald-50/80 backdrop-blur-sm rounded-xl p-2.5 border border-emerald-200">
            <p className="text-[10px] font-black text-emerald-600 uppercase">
              نشط
            </p>
            <p className="text-lg font-black text-emerald-700">{activeUsers}</p>
          </div>
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-2.5 border border-gray-200">
            <p className="text-[10px] font-black text-gray-400 uppercase">
              غير نشط
            </p>
            <p className="text-lg font-black text-gray-600">{inactiveUsers}</p>
          </div>
        </div>

        {/* شريط البحث والفلترة */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#E8D5A3]/50 rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="w-4 h-4 text-[#C9A962]/60" />
              </div>
              <input
                type="text"
                placeholder="ابحث عن موظف بالاسم أو المعرف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FDF8F2] border border-[#E8D5A3] text-[#1A1612] text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] block pr-10 p-2.5 sm:p-3 outline-none transition-all"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-600"
              >
                <Filter size={14} />
                تصفية
              </button>

              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    filterStatus === "all"
                      ? "bg-[#C9A962] text-white"
                      : "bg-[#C9A962]/10 text-[#9A7B3C] hover:bg-[#C9A962]/20"
                  }`}
                >
                  الكل ({users.length})
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    filterStatus === "active"
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  النشطين ({activeUsers})
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    filterStatus === "inactive"
                      ? "bg-gray-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  غير نشط ({inactiveUsers})
                </button>
              </div>

              <button
                onClick={refreshData}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                title="تحديث البيانات"
              >
                <RefreshCw size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* قائمة التصفية للجوال */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden mt-3 pt-3 border-t border-[#E8D5A3]/30"
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFilterStatus("all");
                      setShowFilters(false);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-black ${
                      filterStatus === "all"
                        ? "bg-[#C9A962] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    الكل ({users.length})
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus("active");
                      setShowFilters(false);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-black ${
                      filterStatus === "active"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    نشط ({activeUsers})
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus("inactive");
                      setShowFilters(false);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-black ${
                      filterStatus === "inactive"
                        ? "bg-gray-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    غير نشط ({inactiveUsers})
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* عدد النتائج */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
            {filteredUsers.length} موظف
          </p>
          {filterStatus !== "all" && (
            <button
              onClick={() => setFilterStatus("all")}
              className="text-[10px] font-bold text-[#C9A962] flex items-center gap-1"
            >
              <X size={12} />
              إلغاء التصفية
            </button>
          )}
        </div>

        {/* شبكة الموظفين */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-[#E8D5A3]/30">
            <Users className="mx-auto mb-3 text-gray-300 w-12 h-12" />
            <p className="text-gray-500 font-bold">
              لا يوجد موظفين مطابقين للبحث
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredUsers.map((user, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={user.id}
                className="bg-white/90 backdrop-blur-xl border border-[#E8D5A3]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(201,169,98,0.05)] hover:border-[#C9A962] hover:shadow-[0_15px_40px_rgba(201,169,98,0.1)] transition-all duration-300 relative group"
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F5EBE0] to-[#E8D5A3] border border-[#C9A962]/30 flex items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl font-black text-[#9A7B3C]">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-[#1A1612] flex items-center gap-1.5 truncate">
                      {user.name}
                      {user.role === "المدير العام" && (
                        <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 font-mono mt-0.5">
                      @{user.username || user.email?.split("@")[0] || "user"}
                    </p>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span
                        className={`text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          user.status === "نشط"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.status}
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 flex items-center gap-1">
                        <Clock size={10} />
                        {user.lastLogin || "لم يسجل دخول"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 bg-[#FDF8F2] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#E8D5A3]/30">
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-gray-400 shrink-0" />
                    <span className="text-[10px] sm:text-xs text-gray-600 truncate">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-gray-400 shrink-0" />
                    <span className="text-[10px] sm:text-xs text-gray-600">
                      {user.phone || "غير محدد"}
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      الصلاحيات
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-[#9A7B3C] truncate">
                      {user.permissions || "صلاحيات محدودة"}
                    </p>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="mt-3 sm:mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-[#1A1612] rounded-xl text-[10px] sm:text-xs font-black transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] sm:text-xs font-black transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    حذف
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
