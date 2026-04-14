"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  ArrowRight,
  Home,
  Search,
  Filter,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  User,
  Package,
  FileText,
  Settings,
  X,
  Download,
  Calendar,
  ChevronDown,
  RefreshCw,
  Eye,
  Server,
  Key,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  Activity,
  HardDrive,
  Wifi,
  WifiOff,
  Database,
  CreditCard,
  ShoppingCart,
  Users,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// ✅ مكون نافذة تفاصيل السجل
const LogDetailModal = ({ isOpen, onClose, log }: any) => {
  if (!log) return null;

  const getEventStyle = (type: string) => {
    const styles: any = {
      danger: {
        bg: "bg-rose-100",
        text: "text-rose-600",
        border: "border-rose-200",
        icon: <AlertTriangle size={20} />,
      },
      warning: {
        bg: "bg-amber-100",
        text: "text-amber-600",
        border: "border-amber-200",
        icon: <ShieldAlert size={20} />,
      },
      success: {
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        border: "border-emerald-200",
        icon: <CheckCircle size={20} />,
      },
      info: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        icon: <Info size={20} />,
      },
    };
    return styles[type] || styles.info;
  };

  const style = getEventStyle(log.type);

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
                <h2 className="text-lg sm:text-xl font-black">تفاصيل النشاط</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div
                className={`p-4 rounded-2xl mb-4 ${style.bg} ${style.text} border ${style.border}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {style.icon}
                  <span className="text-sm font-black">{log.action}</span>
                </div>
                <p className="text-sm font-bold">{log.details}</p>
              </div>

              <div className="bg-[#F5EBE0] rounded-2xl p-4 border border-[#E8D5A3]/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#9A7B3C] uppercase">
                      المستخدم
                    </span>
                    <span className="text-sm font-bold">
                      {log.user} ({log.userRole})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#9A7B3C] uppercase">
                      التاريخ والوقت
                    </span>
                    <span className="text-sm font-bold">
                      {log.date} - {log.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#9A7B3C] uppercase">
                      عنوان IP
                    </span>
                    <span className="text-sm font-mono">{log.ip}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#9A7B3C] uppercase">
                      الجهاز
                    </span>
                    <span className="text-sm">{log.device}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#9A7B3C] uppercase">
                      القسم
                    </span>
                    <span className="text-sm">
                      {log.category === "security"
                        ? "الأمان"
                        : log.category === "sales"
                          ? "المبيعات"
                          : log.category === "inventory"
                            ? "المخزون"
                            : "النظام"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[#E8D5A3]/30 p-4 sm:p-5 rounded-b-2xl sm:rounded-b-3xl">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white rounded-xl font-bold text-sm"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function AuditLogSettings() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState("today");
  const [error, setError] = useState("");

  // ✅ البيانات الحقيقية من API
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // ✅ جلب البيانات الحقيقية من API
  const fetchAuditLogs = async () => {
    try {
      const response = await fetch("/api/settings/audit");
      const data = await response.json();

      if (!data.error) {
        setAuditLogs(data);
      } else {
        setError(data.message || "فشل جلب البيانات");
      }
    } catch (err) {
      console.error("خطأ في جلب سجل المراقبة:", err);
      setError("فشل الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
      setMounted(true);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const getEventStyle = (type: string) => {
    const styles: any = {
      danger: {
        icon: <AlertTriangle size={16} />,
        bg: "bg-rose-100",
        text: "text-rose-600",
        border: "border-rose-200",
        badge: "خطر",
      },
      warning: {
        icon: <ShieldAlert size={16} />,
        bg: "bg-amber-100",
        text: "text-amber-600",
        border: "border-amber-200",
        badge: "تحذير",
      },
      success: {
        icon: <CheckCircle size={16} />,
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        border: "border-emerald-200",
        badge: "نجاح",
      },
      info: {
        icon: <Info size={16} />,
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
        badge: "معلومة",
      },
    };
    return styles[type] || styles.info;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "security":
        return <Key size={12} />;
      case "sales":
        return <ShoppingCart size={12} />;
      case "inventory":
        return <Package size={12} />;
      case "system":
        return <Server size={12} />;
      default:
        return <Activity size={12} />;
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.includes(searchQuery) ||
      log.action.includes(searchQuery) ||
      log.details.includes(searchQuery);
    const matchesFilter =
      activeFilter === "all" || log.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAuditLogs();
    setIsRefreshing(false);
  };

  const handleViewLog = (log: any) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  // ✅ تصدير PDF
  const handleExportPDF = () => {
    window.open("/api/settings/audit?export=pdf", "_blank");
  };

  // ✅ إحصائيات سريعة من البيانات الحقيقية
  const stats = {
    total: auditLogs.length,
    security: auditLogs.filter((l) => l.category === "security").length,
    sales: auditLogs.filter((l) => l.category === "sales").length,
    inventory: auditLogs.filter((l) => l.category === "inventory").length,
  };

  // ✅ شاشة تحميل أثناء جلب البيانات
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 w-10 h-10 text-[#C9A962]" />
          <p className="text-sm font-black text-[#1A1612]/50 uppercase tracking-widest">
            جاري تحميل سجل المراقبة...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] text-[#1A1612] selection:bg-[#C9A962]/20 selection:text-[#9A7B3C] pb-20">
      {/* نافذة التفاصيل */}
      <LogDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        log={selectedLog}
      />

      {/* رسالة خطأ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-4 right-4 z-50 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 max-w-5xl mx-auto"
          >
            <AlertCircle size={16} />
            <span className="text-xs sm:text-sm font-bold">{error}</span>
            <button onClick={() => setError("")} className="mr-auto">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
            سجل المراقبة
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className="p-2 bg-gray-100 rounded-xl text-gray-600"
            >
              <RefreshCw
                size={18}
                className={isRefreshing ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={handleExportPDF}
              className="p-2 bg-[#C9A962]/10 rounded-xl text-[#9A7B3C]"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
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
              <History
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#9A7B3C]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#1A1612]">
                سجل النشاطات{" "}
                <span className="text-[#C9A962] font-light text-lg sm:text-xl md:text-2xl">
                  | المراقبة
                </span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#1A1612]/50 mt-1 sm:mt-2 flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]" />
                <span className="hidden sm:inline">
                  مراقبة جميع العمليات، التعديلات، وعمليات الدخول للنظام.
                </span>
                <span className="sm:hidden">مراقبة العمليات والتعديلات</span>
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleRefresh}
              className="hidden sm:flex items-center gap-2 bg-white hover:bg-[#FDF8F2] text-[#1A1612] border border-[#E8D5A3] px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin" : ""}
              />
              تحديث
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleExportPDF}
              className="hidden sm:flex items-center gap-2 bg-white hover:bg-[#FDF8F2] text-[#1A1612] border border-[#E8D5A3] px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-[#C9A962]" />
              تصدير PDF
            </motion.button>
          </div>
        </div>

        {/* بطاقات إحصائية للجوال */}
        <div className="sm:hidden grid grid-cols-4 gap-1.5 mb-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 text-center border border-[#E8D5A3]/30">
            <p className="text-[9px] font-black text-gray-400 uppercase">
              الكل
            </p>
            <p className="text-base font-black text-[#1A1612]">{stats.total}</p>
          </div>
          <div className="bg-amber-50/80 backdrop-blur-sm rounded-xl p-2 text-center border border-amber-200">
            <p className="text-[9px] font-black text-amber-600 uppercase">
              أمان
            </p>
            <p className="text-base font-black text-amber-700">
              {stats.security}
            </p>
          </div>
          <div className="bg-emerald-50/80 backdrop-blur-sm rounded-xl p-2 text-center border border-emerald-200">
            <p className="text-[9px] font-black text-emerald-600 uppercase">
              مبيعات
            </p>
            <p className="text-base font-black text-emerald-700">
              {stats.sales}
            </p>
          </div>
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-2 text-center border border-blue-200">
            <p className="text-[9px] font-black text-blue-600 uppercase">
              مخزون
            </p>
            <p className="text-base font-black text-blue-700">
              {stats.inventory}
            </p>
          </div>
        </div>

        {/* فلاتر البحث */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#E8D5A3]/50 rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="w-4 h-4 text-[#C9A962]/60" />
              </div>
              <input
                type="text"
                placeholder="ابحث عن موظف، حدث، أو رقم فاتورة..."
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
                {[
                  { id: "all", label: "الكل" },
                  { id: "security", label: "الأمان" },
                  { id: "sales", label: "المبيعات" },
                  { id: "inventory", label: "المخزون" },
                  { id: "system", label: "النظام" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      activeFilter === filter.id
                        ? "bg-[#C9A962] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
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
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                  تصفية حسب القسم
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: "الكل" },
                    { id: "security", label: "الأمان" },
                    { id: "sales", label: "المبيعات" },
                    { id: "inventory", label: "المخزون" },
                    { id: "system", label: "النظام" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => {
                        setActiveFilter(filter.id);
                        setShowFilters(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                        activeFilter === filter.id
                          ? "bg-[#C9A962] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* عدد النتائج */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
            {filteredLogs.length} نشاط
          </p>
          {activeFilter !== "all" && (
            <button
              onClick={() => setActiveFilter("all")}
              className="text-[10px] font-bold text-[#C9A962] flex items-center gap-1"
            >
              <X size={12} />
              إلغاء التصفية
            </button>
          )}
        </div>

        {/* قائمة السجل (Timeline) */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#E8D5A3]/50 rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 shadow-[0_15px_40px_rgba(201,169,98,0.05)] relative overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16">
              <History className="mx-auto mb-3 text-gray-300 w-12 h-12" />
              <p className="text-gray-500 font-bold">
                لا توجد سجلات مطابقة للبحث
              </p>
            </div>
          ) : (
            <div className="relative border-r-2 border-[#E8D5A3]/50 pr-3 sm:pr-5 md:pr-6 space-y-5 sm:space-y-6 md:space-y-8">
              {filteredLogs.map((log, index) => {
                const style = getEventStyle(log.type);

                return (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={log.id}
                    className="relative"
                  >
                    {/* النقطة على الخط الزمني */}
                    <div
                      className={`absolute -right-[19px] sm:-right-[29px] md:-right-[35px] top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-4 border-white ${style.bg} ${style.text} flex items-center justify-center shadow-sm z-10`}
                    >
                      {style.icon}
                    </div>

                    <div
                      onClick={() => handleViewLog(log)}
                      className={`bg-white border ${style.border} rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden`}
                    >
                      <div
                        className={`absolute top-0 right-0 w-1 h-full ${style.bg} opacity-50`}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span
                              className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${style.bg} ${style.text}`}
                            >
                              {getCategoryIcon(log.category)}
                              <span className="hidden sm:inline">
                                {log.action}
                              </span>
                            </span>
                            <span
                              className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md ${style.bg} ${style.text}`}
                            >
                              {style.badge}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 flex items-center gap-1">
                              <Clock size={10} />
                              <span className="sm:hidden">{log.time}</span>
                              <span className="hidden sm:inline">
                                {log.date} - {log.time}
                              </span>
                            </span>
                          </div>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-[#1A1612] leading-relaxed line-clamp-2">
                            {log.details}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[9px] sm:text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-gray-600">
                          <User size={11} className="text-[#C9A962]" />
                          <span className="truncate max-w-[120px] sm:max-w-none">
                            {log.user}
                          </span>
                          <span className="text-gray-400 hidden sm:inline">
                            ({log.userRole})
                          </span>
                        </div>
                        <div className="font-mono text-gray-400 font-bold hidden sm:block">
                          IP: {log.ip}
                        </div>
                        <button className="sm:hidden p-1 hover:bg-gray-100 rounded-lg">
                          <Eye size={14} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* معلومات إضافية */}
        <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-[#E8D5A3]/30">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-[#C9A962]/10 rounded-lg">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9A7B3C]" />
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-[#1A1612]/60">
              يتم الاحتفاظ بسجل النشاطات لمدة 90 يوماً. يمكنك تصدير السجل بصيغة
              PDF للاحتفاظ بنسخة دائمة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
