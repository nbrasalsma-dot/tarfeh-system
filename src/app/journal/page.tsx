"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Plus,
  Receipt,
  Search,
  Loader2,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Calendar,
  User,
  Hash,
  FileText,
  ChevronRight,
  Filter,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  CircleDollarSign,
  MoreHorizontal,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useSession } from "next-auth/react";

// --- مكون بطاقة العملية للجوال ---
const MobileTransactionCard = ({ tx }: any) => {
  const getTypeStyles = () => {
    switch (tx.type) {
      case "sale":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: <TrendingUp size={14} />,
          label: "مبيعات",
        };
      case "purchase":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          icon: <TrendingDown size={14} />,
          label: "مشتريات",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: <CreditCard size={14} />,
          label: "مصروفات",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className={`${styles.bg} border ${styles.border} rounded-2xl p-4 mb-3 shadow-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${styles.bg}`}>{styles.icon}</div>
          <span className={`text-[10px] font-black uppercase ${styles.text}`}>
            {styles.label}
          </span>
        </div>
        <span className="text-[8px] font-bold text-gray-400 bg-white/50 px-2 py-1 rounded-full">
          {tx.referenceId || "بدون مرجع"}
        </span>
      </div>

      <p className="text-sm font-black text-[#1A1612] mb-2 line-clamp-2">
        {tx.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-600">
              {tx.merchantName || "عميل عام"}
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400">
              {new Date(tx.date).toLocaleDateString("ar-YE")}
            </span>
          </div>
        </div>
        <p
          className={`text-base font-black font-mono ${tx.type === "purchase" ? "text-rose-600" : "text-[#9A7B3C]"}`}
        >
          {Number(tx.amount).toLocaleString()}
          <span className="text-[10px] mr-1">{tx.currency}</span>
        </p>
      </div>
    </motion.div>
  );
};

export default function JournalPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, sale, purchase, expense
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // بيانات النموذج الجديد
  const [formData, setFormData] = useState({
    referenceId: "",
    type: "sale", // sale, purchase, expense
    amount: "",
    currency: "YER",
    description: "",
    merchantName: "",
  });

  // إحصائيات سريعة
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPurchases: 0,
    totalExpenses: 0,
    balance: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. جلب البيانات (العمليات والموردين)
  const fetchData = async () => {
    try {
      const [resTx, resSup] = await Promise.all([
        fetch("/api/journal"),
        fetch("/api/merchants"),
      ]);
      const dataTx = await resTx.json();
      const dataSup = await resSup.json();

      if (!dataTx.error) {
        setTransactions(dataTx);
        // حساب الإحصائيات
        let sales = 0,
          purchases = 0,
          expenses = 0;
        dataTx.forEach((tx: any) => {
          if (tx.type === "sale") sales += Number(tx.amount);
          else if (tx.type === "purchase") purchases += Number(tx.amount);
          else expenses += Number(tx.amount);
        });
        setStats({
          totalSales: sales,
          totalPurchases: purchases,
          totalExpenses: expenses,
          balance: sales - purchases - expenses,
        });
      }
      if (!dataSup.error) setSuppliers(dataSup);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted]);

  // 2. معالجة الإضافة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          referenceId: "",
          type: "sale",
          amount: "",
          currency: "YER",
          description: "",
          merchantName: "",
        });
        fetchData(); // تحديث القائمة
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // تصفية العمليات
  const filteredTransactions = transactions.filter((tx: any) => {
    const matchesType = filterType === "all" || tx.type === filterType;
    const matchesSearch =
      searchTerm === "" ||
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.referenceId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* الترويسة الفخمة - متجاوبة */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="p-2 sm:p-3 bg-gradient-to-br from-[#9A7B3C] to-[#C9A962] rounded-xl sm:rounded-2xl shadow-lg"
            >
              <Calculator className="text-white w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1612] italic tracking-tight">
                القيود اليومية
              </h1>
              <p className="text-gray-500 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5 sm:mt-1">
                سجل الحركات المالية الموحد
              </p>
              <p className="text-[#9A7B3C]/200 text-[8px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                نظام ترفة لإدارة الموارد المحاسبية
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-xl border border-[#C9A962]/30 flex items-center justify-center gap-2 sm:gap-3"
          >
            <Plus
              size={16}
              className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#C9A962]"
            />
            <span className="whitespace-nowrap">قيد جديد</span>
          </motion.button>
        </div>

        {/* بطاقات الإحصائيات السريعة - متجاوبة */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <div className="p-1 sm:p-1.5 bg-emerald-100 rounded-lg">
                <TrendingUp
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-emerald-700"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                المبيعات
              </span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-black text-[#1A1612]">
              {stats.totalSales.toLocaleString()}
              <span className="text-[8px] sm:text-[10px] font-medium text-gray-400 mr-1">
                YER
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <div className="p-1 sm:p-1.5 bg-rose-100 rounded-lg">
                <TrendingDown
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-rose-700"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                المشتريات
              </span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-black text-[#1A1612]">
              {stats.totalPurchases.toLocaleString()}
              <span className="text-[8px] sm:text-[10px] font-medium text-gray-400 mr-1">
                YER
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <div className="p-1 sm:p-1.5 bg-gray-100 rounded-lg">
                <CreditCard
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-700"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                المصروفات
              </span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-black text-[#1A1612]">
              {stats.totalExpenses.toLocaleString()}
              <span className="text-[8px] sm:text-[10px] font-medium text-gray-400 mr-1">
                YER
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 border backdrop-blur-sm ${
              stats.balance >= 0
                ? "bg-emerald-50/80 border-emerald-200"
                : "bg-rose-50/80 border-rose-200"
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <div
                className={`p-1 sm:p-1.5 rounded-lg ${stats.balance >= 0 ? "bg-emerald-100" : "bg-rose-100"}`}
              >
                <CircleDollarSign
                  size={12}
                  className={`sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${stats.balance >= 0 ? "text-emerald-700" : "text-rose-700"}`}
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                الصافي
              </span>
            </div>
            <p
              className={`text-sm sm:text-base md:text-lg font-black ${stats.balance >= 0 ? "text-emerald-700" : "text-rose-700"}`}
            >
              {stats.balance.toLocaleString()}
              <span className="text-[8px] sm:text-[10px] font-medium opacity-60 mr-1">
                YER
              </span>
            </p>
          </motion.div>
        </div>

        {/* شريط البحث والتصفية - متجاوب */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث في القيود..."
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

            <div
              className={`${showFilters ? "flex" : "hidden"} sm:flex gap-1.5 sm:gap-2 flex-wrap`}
            >
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

        {/* عدد النتائج */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
            {filteredTransactions.length} عملية مالية
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

        {/* المحتوى الرئيسي - عرض الجوال والكمبيوتر */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 opacity-40">
            <Loader2 className="animate-spin mb-3 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            <p className="font-bold text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              جاري جلب القيود...
            </p>
          </div>
        ) : (
          <>
            {/* عرض الجوال - بطاقات */}
            <div className="block sm:hidden space-y-2">
              {filteredTransactions.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-[#E8D5A3]/20">
                  <Receipt className="mx-auto mb-3 text-gray-300" size={48} />
                  <p className="text-sm font-bold text-gray-400">
                    لا توجد قيود مسجلة
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    ابدأ بإضافة أول قيد مالي
                  </p>
                </div>
              ) : (
                filteredTransactions.map((tx: any) => (
                  <MobileTransactionCard key={tx.id} tx={tx} />
                ))
              )}
            </div>

            {/* عرض الكمبيوتر - جدول */}
            <div className="hidden sm:block bg-white/80 backdrop-blur-xl border border-[#E8D5A3]/30 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#FAF3E8]/80 to-[#FDF8F2]/80 border-b border-[#E8D5A3]/30">
                      <th className="p-3 sm:p-4 md:p-6 text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase tracking-widest">
                        النوع
                      </th>
                      <th className="p-3 sm:p-4 md:p-6 text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase tracking-widest">
                        البيان / الوصف
                      </th>
                      <th className="p-3 sm:p-4 md:p-6 text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase tracking-widest">
                        المرجع
                      </th>
                      <th className="p-3 sm:p-4 md:p-6 text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase tracking-widest">
                        المورد / التاجر
                      </th>
                      <th className="p-3 sm:p-4 md:p-6 text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase tracking-widest">
                        المبلغ
                      </th>
                      <th className="p-3 sm:p-4 md:p-6 text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase tracking-widest">
                        التاريخ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-12 sm:p-16 md:p-20 text-center text-gray-400 font-bold italic opacity-50"
                        >
                          <Receipt
                            className="mx-auto mb-3 opacity-30"
                            size={40}
                          />
                          لا توجد قيود مسجلة حتى الآن
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx: any) => (
                        <tr
                          key={tx.id}
                          className="hover:bg-[#FFFBF7] transition-colors group"
                        >
                          <td className="p-3 sm:p-4 md:p-6">
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase whitespace-nowrap ${
                                tx.type === "sale"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : tx.type === "purchase"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {tx.type === "sale"
                                ? "مبيعات"
                                : tx.type === "purchase"
                                  ? "مشتريات"
                                  : "مصروفات"}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 md:p-6 font-bold text-[#1A1612] text-xs sm:text-sm max-w-[200px] truncate">
                            {tx.description}
                          </td>
                          <td className="p-3 sm:p-4 md:p-6 text-gray-400 font-mono text-[10px] sm:text-xs">
                            {tx.referenceId || "---"}
                          </td>
                          <td className="p-3 sm:p-4 md:p-6 text-gray-600 font-bold text-xs sm:text-sm">
                            {tx.merchantName || "عميل عام"}
                          </td>
                          <td className="p-3 sm:p-4 md:p-6">
                            <span
                              className={`text-sm sm:text-base font-black font-mono whitespace-nowrap ${tx.type === "purchase" ? "text-rose-600" : "text-[#9A7B3C]"}`}
                            >
                              {Number(tx.amount).toLocaleString()} {tx.currency}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 md:p-6 text-gray-400 text-[10px] sm:text-xs font-bold whitespace-nowrap">
                            {new Date(tx.date).toLocaleDateString("ar-YE")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* نافذة الإضافة (Modal) - متجاوبة ومصغرة */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[95%] sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-4 sm:p-6 md:p-8 shadow-2xl border border-[#C9A962]/20"
            >
              <div className="absolute top-0 right-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#E8D5A3]" />

              {/* زر الإغلاق */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 sm:top-4 left-3 sm:left-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X
                  size={16}
                  className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400"
                />
              </button>

              <div className="mb-5 sm:mb-6 md:mb-8 mt-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1A1612] italic">
                  تسجيل قيد مالي
                </h2>
                <p className="text-gray-400 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest mt-1">
                  تحديث سجلات ترفة المركزية
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5 sm:gap-2">
                      <Hash size={10} className="sm:w-3 sm:h-3" /> رقم المرجع
                      (اختياري)
                    </label>
                    <input
                      value={formData.referenceId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          referenceId: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 focus:border-[#C9A962] outline-none font-bold text-black text-xs sm:text-sm"
                      placeholder="مثلاً: INV-001"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5 sm:gap-2">
                      <ArrowUpRight size={10} className="sm:w-3 sm:h-3" /> نوع
                      العملية
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 focus:border-[#C9A962] outline-none font-black text-black text-xs sm:text-sm appearance-none"
                    >
                      <option value="sale">مبيعات / تحصيل</option>
                      <option value="purchase">مشتريات / توريد</option>
                      <option value="expense">مصروفات تشغيلية</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5 sm:gap-2">
                      <Wallet size={10} className="sm:w-3 sm:h-3" /> المبلغ
                    </label>
                    <div className="flex gap-2">
                      <input
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        className="flex-1 bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 focus:border-[#C9A962] outline-none font-black text-black text-xs sm:text-sm"
                        placeholder="0.00"
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) =>
                          setFormData({ ...formData, currency: e.target.value })
                        }
                        className="w-20 sm:w-24 bg-[#FAF3E8] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-2 font-black text-black text-[10px] sm:text-xs"
                      >
                        <option value="YER">YER</option>
                        <option value="USD">USD</option>
                        <option value="SAR">SAR</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5 sm:gap-2">
                      <User size={10} className="sm:w-3 sm:h-3" /> المورد /
                      التاجر
                    </label>
                    <select
                      value={formData.merchantName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          merchantName: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 focus:border-[#C9A962] outline-none font-bold text-black text-xs sm:text-sm appearance-none"
                    >
                      <option value="">عميل عام / غير محدد</option>
                      {suppliers.map((s: any) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5 sm:gap-2">
                    <FileText size={10} className="sm:w-3 sm:h-3" /> البيان
                    (الوصف)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 focus:border-[#C9A962] outline-none font-bold text-black text-xs sm:text-sm resize-none"
                    placeholder="اكتب تفاصيل العملية هنا..."
                  />
                </div>

                <div className="flex gap-2 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex-[2] w-full bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 border border-[#C9A962]/30"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs">
                          جاري التثبيت...
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle
                          size={14}
                          className="sm:w-4 sm:h-4 text-[#C9A962]"
                        />
                        <span className="text-[10px] sm:text-xs">
                          تثبيت القيد
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
