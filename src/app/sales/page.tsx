"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Receipt,
  Search,
  Calendar,
  User,
  ArrowLeft,
  Download,
  Filter,
  Loader2,
  DollarSign,
  Hash,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Clock,
  Package,
  Printer,
  Share2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Wallet,
  Home,
  RefreshCw,
  BarChart3,
  CircleDollarSign,
} from "lucide-react";
import Link from "next/link";

// --- مكون بطاقة المبيعات للجوال ---
const MobileSaleCard = ({ sale, onView }: any) => {
  const date = new Date(sale.date);
  const formattedDate = date.toLocaleDateString("ar-YE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("ar-YE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // تحديد نوع العملية
  const getTypeStyles = () => {
    if (sale.type === "sale") {
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-900",
        border: "border-emerald-200",
        icon: <TrendingUp size={14} />,
        label: "مبيعات",
      };
    } else if (sale.type === "purchase") {
      return {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: <TrendingDown size={14} />,
        label: "مشتريات",
      };
    } else {
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: <CircleDollarSign size={14} />,
        label: "مصروفات",
      };
    }
  };

  const styles = getTypeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-4 border border-[#E8D5A3]/30 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 ${styles.bg} rounded-xl flex items-center justify-center ${styles.text}`}
          >
            <Receipt size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#C9A962] uppercase tracking-wider">
              {sale.referenceId || "بدون مرجع"}
            </p>
            <h3 className="font-black text-sm text-[#1A1612] flex items-center gap-1.5">
              <User size={12} className="text-[#1A1612]" />
              {sale.merchantName || "عميل نقدي"}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(sale)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Eye size={14} className="text-[#1A1612]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#FDF8F2] p-2.5 rounded-xl">
          <p className="text-[8px] text-[#1A1612] font-black uppercase mb-1">
            المبلغ
          </p>
          <p className="text-lg font-black text-[#C9A962]">
            {Number(sale.amount).toLocaleString()}
            <span className="text-[10px] text-[#1A1612] mr-1">
              {sale.currency || "YER"}
            </span>
          </p>
        </div>
        <div className="bg-[#FDF8F2] p-2.5 rounded-xl">
          <p className="text-[8px] text-[#1A1612] font-black uppercase mb-1">
            نوع العملية
          </p>
          <p
            className={`text-sm font-black flex items-center gap-1 ${styles.text}`}
          >
            {styles.icon}
            {styles.label}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-[#1A1612]" />
          <span className="text-[10px] text-[#1A1612]">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-[#1A1612]" />
          <span className="text-[10px] text-[#1A1612]">{formattedTime}</span>
        </div>
        <div
          className={`px-2 py-0.5 rounded-full text-[8px] font-black ${styles.bg} ${styles.text}`}
        >
          {sale.currency || "YER"}
        </div>
      </div>
    </motion.div>
  );
};

// --- مكون نافذة تفاصيل الفاتورة ---
const InvoiceDetailModal = ({ isOpen, onClose, sale }: any) => {
  if (!sale) return null;

  const date = new Date(sale.date);
  const formattedDate = date.toLocaleDateString("ar-YE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("ar-YE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getTypeLabel = () => {
    if (sale.type === "sale") return "مبيعات";
    if (sale.type === "purchase") return "مشتريات";
    return "مصروفات";
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
            className="relative w-full max-w-[95%] sm:max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#C9A962]/20"
          >
            <div className="sticky top-0 bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white p-4 sm:p-5 rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black">
                  تفاصيل العملية
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {/* ✅ خلفية أغمق وحدود أوضح */}
              <div className="bg-[#F5EBE0] rounded-2xl p-4 mb-4 border border-[#E8D5A3]/50">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    {/* ✅ لون عنوان أغمق */}
                    <span className="text-[#9A7B3C] font-black text-xs">
                      رقم المرجع
                    </span>
                    {/* ✅ لون القيمة أغمق */}
                    <p className="font-black text-[#1A1612] text-base">
                      {sale.referenceId || "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#9A7B3C] font-black text-xs">
                      العميل/المورد
                    </span>
                    <p className="font-black text-[#1A1612] text-base">
                      {sale.merchantName || "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#9A7B3C] font-black text-xs">
                      التاريخ
                    </span>
                    <p className="font-black text-[#1A1612] text-sm">
                      {formattedDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#9A7B3C] font-black text-xs">
                      الوقت
                    </span>
                    <p className="font-black text-[#1A1612] text-sm">
                      {formattedTime}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#9A7B3C] font-black text-xs">
                      نوع العملية
                    </span>
                    <p
                      className={`font-black text-base ${sale.type === "sale" ? "text-emerald-600" : sale.type === "purchase" ? "text-rose-600" : "text-amber-600"}`}
                    >
                      {getTypeLabel()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#9A7B3C] font-black text-xs">
                      العملة
                    </span>
                    <p className="font-black text-[#1A1612] text-base">
                      {sale.currency || "YER"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E8D5A3] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-[#1A1612]">
                    المبلغ الإجمالي
                  </span>
                  <span className="text-2xl font-black text-[#C9A962]">
                    {Number(sale.amount).toLocaleString()}{" "}
                    {sale.currency || "YER"}
                  </span>
                </div>
                {sale.description && (
                  <div className="mt-4 p-3 bg-[#F5EBE0] rounded-xl border border-[#E8D5A3]/30">
                    <p className="text-[#9A7B3C] font-black text-xs mb-1">
                      الوصف
                    </p>
                    <p className="text-sm font-bold text-[#1A1612]">
                      {sale.description}
                    </p>
                  </div>
                )}
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

export default function SalesHistoryPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, sale, purchase, expense
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPurchases: 0,
    totalExpenses: 0,
    netProfit: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // جلب البيانات
  const fetchSales = async () => {
    try {
      const res = await fetch("/api/sales");
      const data = await res.json();
      if (!data.error) {
        setSales(data);

        // حساب الإحصائيات
        let salesTotal = 0,
          purchasesTotal = 0,
          expensesTotal = 0;
        data.forEach((s: any) => {
          if (s.type === "sale") salesTotal += Number(s.amount);
          else if (s.type === "purchase") purchasesTotal += Number(s.amount);
          else expensesTotal += Number(s.amount);
        });

        setStats({
          totalSales: salesTotal,
          totalPurchases: purchasesTotal,
          totalExpenses: expensesTotal,
          netProfit: salesTotal - purchasesTotal - expensesTotal,
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchSales();
    }
  }, [mounted]);

  // تصفية الفواتير
  const filteredSales = sales.filter((s: any) => {
    const matchesSearch =
      s.merchantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || s.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalRevenue = filteredSales.reduce(
    (sum, s: any) => sum + Number(s.amount),
    0,
  );
  const totalSalesCount = filteredSales.filter(
    (s: any) => s.type === "sale",
  ).length;
  const totalPurchasesCount = filteredSales.filter(
    (s: any) => s.type === "purchase",
  ).length;

  const handleView = (sale: any) => {
    setSelectedSale(sale);
    setIsDetailModalOpen(true);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* الترويسة - متجاوبة */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/">
              <button className="p-2 sm:p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                <ArrowRight className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>
            <div className="p-2 sm:p-3 bg-gradient-to-br from-[#1A1612] to-[#2A241E] rounded-xl sm:rounded-2xl shadow-lg">
              <Receipt className="text-[#C9A962] w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1A1612] italic tracking-tight">
                سجل المبيعات
              </h1>
              <p className="text-[#1A1612] font-bold text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5">
                أرشيف الفواتير والعمليات المنفذة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="bg-white/80 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-[#E8D5A3]/30 shadow-sm flex items-center gap-3 flex-1 sm:flex-none justify-center">
              <div className="text-center">
                <p className="text-[7px] sm:text-[8px] font-black text-[#1A1612] uppercase">
                  إجمالي القائمة
                </p>
                <p className="text-base sm:text-lg font-black text-[#C9A962]">
                  {totalRevenue.toLocaleString()}{" "}
                  <span className="text-[9px] sm:text-[10px] text-[#1A1612]">
                    YER
                  </span>
                </p>
              </div>
              <DollarSign className="text-[#C9A962] w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <button
              onClick={fetchSales}
              className="p-2 sm:p-2.5 bg-white/80 border border-[#E8D5A3]/30 rounded-xl hover:bg-white transition-colors"
            >
              <RefreshCw size={16} className="sm:w-4 sm:h-4 text-[#1A1612]" />
            </button>
          </div>
        </div>

        {/* بطاقات الإحصائيات - متجاوبة */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div className="p-1 sm:p-1.5 bg-emerald-100 rounded-lg">
                <TrendingUp
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-emerald-700"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-[#1A1612] uppercase">
                المبيعات
              </span>
            </div>
            <p className="text-sm sm:text-base font-black text-[#1A1612]">
              {stats.totalSales.toLocaleString()}
              <span className="text-[8px] sm:text-[10px] text-[#1A1612] mr-1">
                YER
              </span>
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div className="p-1 sm:p-1.5 bg-rose-100 rounded-lg">
                <TrendingDown
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-rose-700"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-[#1A1612] uppercase">
                المشتريات
              </span>
            </div>
            <p className="text-sm sm:text-base font-black text-[#1A1612]">
              {stats.totalPurchases.toLocaleString()}
              <span className="text-[8px] sm:text-[10px] text-[#1A1612] mr-1">
                YER
              </span>
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div className="p-1 sm:p-1.5 bg-amber-100 rounded-lg">
                <CircleDollarSign
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-amber-700"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-[#1A1612] uppercase">
                المصروفات
              </span>
            </div>
            <p className="text-sm sm:text-base font-black text-[#1A1612]">
              {stats.totalExpenses.toLocaleString()}
              <span className="text-[8px] sm:text-[10px] text-[#1A1612] mr-1">
                YER
              </span>
            </p>
          </div>
          <div
            className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 border backdrop-blur-sm ${stats.netProfit >= 0 ? "bg-emerald-50/80 border-emerald-200" : "bg-rose-50/80 border-rose-200"}`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div
                className={`p-1 sm:p-1.5 rounded-lg ${stats.netProfit >= 0 ? "bg-emerald-100" : "bg-rose-100"}`}
              >
                <BarChart3
                  size={12}
                  className={`sm:w-3.5 sm:h-3.5 ${stats.netProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-[#1A1612] uppercase">
                الصافي
              </span>
            </div>
            <p
              className={`text-sm sm:text-base font-black ${stats.netProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}
            >
              {stats.netProfit.toLocaleString()}
              <span className="text-[8px] sm:text-[10px] opacity-60 mr-1">
                YER
              </span>
            </p>
          </div>
        </div>

        {/* شريط البحث والتصفية - متجاوب */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#1A1612] w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <input
              type="text"
              placeholder="ابحث برقم الفاتورة أو اسم العميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-sm border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 pr-9 sm:pr-10 text-xs sm:text-sm focus:border-[#C9A962] outline-none transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden px-3 py-2 bg-white/80 border border-[#E8D5A3]/30 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-1.5"
            >
              <Filter size={14} />
              تصفية
            </button>

            <div className="hidden sm:flex gap-1.5 sm:gap-2">
              {[
                { value: "all", label: "الكل" },
                { value: "sale", label: "مبيعات" },
                { value: "purchase", label: "مشتريات" },
                { value: "expense", label: "مصروفات" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                    filterType === filter.value
                      ? "bg-[#C9A962] text-white shadow-md"
                      : "bg-white/60 text-gray-600 border border-[#E8D5A3]/30 hover:bg-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* قائمة التصفية للجوال */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden mb-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-[#E8D5A3]/30"
          >
            <p className="text-[10px] font-black text-[#1A1612] uppercase mb-2">
              نوع العملية
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: "all", label: "الكل" },
                { value: "sale", label: "مبيعات" },
                { value: "purchase", label: "مشتريات" },
                { value: "expense", label: "مصروفات" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setFilterType(filter.value);
                    setShowFilters(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                    filterType === filter.value
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

        {/* عدد النتائج */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-bold text-[#1A1612] uppercase tracking-wider">
            {filteredSales.length} عملية
          </p>
          {filterType !== "all" && (
            <button
              onClick={() => setFilterType("all")}
              className="text-[10px] font-bold text-[#C9A962] flex items-center gap-1"
            >
              <X size={12} />
              إلغاء التصفية
            </button>
          )}
        </div>

        {/* عرض المحتوى */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 opacity-40">
            <Loader2 className="animate-spin mb-3 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10" />
            <p className="font-bold text-xs sm:text-sm uppercase tracking-widest">
              جاري استرجاع الأرشيف...
            </p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-[2rem] border-2 border-dashed border-[#E8D5A3]/30">
            <Receipt
              className="mx-auto mb-3 sm:mb-4 text-gray-300 w-12 h-12 sm:w-14 sm:h-14"
              strokeWidth={1}
            />
            <p className="text-[#1A1612] font-bold text-sm sm:text-base">
              لا توجد عمليات مسجلة
            </p>
            <p className="text-[#1A1612] text-xs mt-1">
              ابدأ بإضافة العمليات المالية
            </p>
          </div>
        ) : (
          <>
            {/* عرض الجوال - بطاقات */}
            <div className="block sm:hidden space-y-2.5">
              {filteredSales.map((sale: any) => (
                <MobileSaleCard key={sale.id} sale={sale} onView={handleView} />
              ))}
            </div>

            {/* عرض الكمبيوتر - جدول */}
            <div className="hidden sm:block">
              <div className="grid gap-3">
                {filteredSales.map((sale: any) => {
                  const getTypeStyles = () => {
                    if (sale.type === "sale") {
                      return {
                        bg: "bg-emerald-50",
                        text: "text-emerald-700",
                        label: "مبيعات",
                      };
                    } else if (sale.type === "purchase") {
                      return {
                        bg: "bg-rose-50",
                        text: "text-rose-700",
                        label: "مشتريات",
                      };
                    } else {
                      return {
                        bg: "bg-amber-50",
                        text: "text-amber-700",
                        label: "مصروفات",
                      };
                    }
                  };

                  const styles = getTypeStyles();

                  return (
                    <motion.div
                      key={sale.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-[#E8D5A3]/20 p-4 rounded-2xl hover:shadow-lg transition-all flex flex-col md:flex-row items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div
                          className={`w-12 h-12 ${styles.bg} rounded-xl flex items-center justify-center ${styles.text} shrink-0 group-hover:bg-[#1A1612] group-hover:text-[#C9A962] transition-colors`}
                        >
                          <Hash size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black text-[#C9A962] uppercase tracking-tighter">
                              {sale.referenceId || "بدون مرجع"}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[8px] font-black ${styles.bg} ${styles.text}`}
                            >
                              {styles.label}
                            </span>
                          </div>
                          <h3 className="font-black text-[#1A1612] truncate flex items-center gap-2">
                            <User size={14} className="text-[#1A1612]" />
                            {sale.merchantName || "عميل نقدي"}
                          </h3>
                          {sale.description && (
                            <p className="text-[10px] text-[#1A1612] truncate mt-0.5">
                              {sale.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full md:w-auto md:gap-8 px-2 md:px-0">
                        <div className="text-right md:text-center">
                          <p className="text-[8px] font-black text-[#1A1612] uppercase flex items-center gap-1 md:justify-center">
                            <Calendar size={10} /> التاريخ
                          </p>
                          <p className="text-xs font-bold text-gray-600">
                            {new Date(sale.date).toLocaleDateString("ar-YE")}
                          </p>
                        </div>

                        <div className="text-left md:text-center">
                          <p className="text-[8px] font-black text-[#1A1612] uppercase">
                            المبلغ
                          </p>
                          <p className="text-base font-black text-[#1A1612]">
                            {Number(sale.amount).toLocaleString()}
                            <span className="text-[10px] text-[#1A1612] mr-1">
                              {sale.currency || "YER"}
                            </span>
                          </p>
                        </div>

                        <button
                          onClick={() => handleView(sale)}
                          className="p-2 bg-gray-50 text-[#1A1612] hover:bg-[#C9A962] hover:text-white rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* نافذة التفاصيل */}
        <InvoiceDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          sale={selectedSale}
        />
      </div>
    </div>
  );
}
