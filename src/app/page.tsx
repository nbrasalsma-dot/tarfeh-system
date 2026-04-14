"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Users,
  Package,
  Receipt,
  Sparkles,
  Crown,
  TrendingUp,
  ShieldCheck,
  Plus,
  Search,
  Bell,
  LogOut,
  Calendar,
  Clock,
  ArrowUpRight,
  ChevronRight,
  BarChart3,
  Wallet,
  Gem,
  Star,
  TrendingDown,
  Activity,
  CircleDollarSign,
  BadgeCheck,
  Zap,
  X,
  Eye,
  User,
  CreditCard,
  Banknote,
  Hash,
  ArrowLeft,
  //Home,
  Menu,
  Loader2,
  DollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

// --- مكون الخلفية السائلة المتطورة (ألوان ترفة الفاخرة) ---
const LiquidBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8]">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.28, 0.12],
          rotate: [0, 45, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[15%] -right-[15%] w-[80%] h-[80%] bg-gradient-to-br from-[#C9A962]/20 via-[#E8D5A3]/15 to-transparent rounded-full blur-[130px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.08, 0.2, 0.08],
          rotate: [0, -35, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[20%] -left-[20%] w-[90%] h-[90%] bg-gradient-to-tl from-[#9A7B3C]/12 via-[#C9A962]/8 to-transparent rounded-full blur-[140px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.06, 0.15, 0.06],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-[#D4B36A]/10 rounded-full blur-[100px]"
      />
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
      <div className="absolute inset-0 opacity-[0.015] bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')]"></div>
    </div>
  );
};

// --- مكون الجسيمات الذهبية العائمة ---
const FloatingGoldParticles = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const particles = [
    { x: 5, y: 15, delay: 0, duration: 8 },
    { x: 85, y: 25, delay: 1, duration: 10 },
    { x: 45, y: 75, delay: 2, duration: 9 },
    { x: 15, y: 85, delay: 0.5, duration: 11 },
    { x: 75, y: 65, delay: 1.5, duration: 7 },
    { x: 95, y: 55, delay: 2.5, duration: 12 },
    { x: 35, y: 45, delay: 3, duration: 8 },
    { x: 65, y: 15, delay: 1.8, duration: 9 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
          animate={{
            y: [`${p.y}%`, `${p.y - 15}%`, `${p.y}%`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 bg-[#C9A962] rounded-full blur-[1px] shadow-[0_0_10px_rgba(201,169,98,0.5)]"
        />
      ))}
    </div>
  );
};

// --- مكون الإشعارات المنبثقة ---
const NotificationBadge = ({ count }: { count: number }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#C75050] to-[#D4A5A5] rounded-full flex items-center justify-center border border-white"
    >
      <span className="text-[8px] font-black text-white">{count}</span>
    </motion.div>
  );
};

// --- نافذة تفاصيل العملية ---
const TransactionDetailModal = ({ isOpen, onClose, transaction }: any) => {
  if (!transaction) return null;

  const date = new Date(transaction.date);
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
    if (transaction.type === "sale") return "مبيعات";
    if (transaction.type === "purchase") return "مشتريات";
    return "مصروفات";
  };

  const getTypeColor = () => {
    if (transaction.type === "sale")
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (transaction.type === "purchase")
      return "text-rose-600 bg-rose-50 border-rose-200";
    return "text-amber-600 bg-amber-50 border-amber-200";
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
              <div className={`p-4 rounded-2xl mb-4 ${getTypeColor()}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-xl ${transaction.type === "sale" ? "bg-emerald-100" : transaction.type === "purchase" ? "bg-rose-100" : "bg-amber-100"}`}
                  >
                    {transaction.type === "sale" ? (
                      <TrendingUp size={20} />
                    ) : transaction.type === "purchase" ? (
                      <TrendingDown size={20} />
                    ) : (
                      <CircleDollarSign size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black">{getTypeLabel()}</p>
                    <p className="text-[10px] opacity-70">
                      {transaction.referenceId || "بدون مرجع"}
                    </p>
                  </div>
                </div>
                <p className="text-3xl font-black">
                  {Number(transaction.amount).toLocaleString()}{" "}
                  {transaction.currency || "YER"}
                </p>
              </div>

              <div className="bg-[#F5EBE0] rounded-2xl p-4 border border-[#E8D5A3]/50">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[#9A7B3C] font-black text-[10px] uppercase">
                      العميل/المورد
                    </span>
                    <p className="font-black text-[#1A1612] flex items-center gap-1 mt-1">
                      <User size={14} className="text-gray-500" />
                      {transaction.merchantName || "غير محدد"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#9A7B3C] font-black text-[10px] uppercase">
                      التاريخ والوقت
                    </span>
                    <p className="font-black text-[#1A1612] flex items-center gap-1 mt-1">
                      <Calendar size={14} className="text-gray-500" />
                      {formattedDate}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock size={12} />
                      {formattedTime}
                    </p>
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5 opacity-60">
                      <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-[#C9A962]" />
                      <div className="flex items-center gap-1">
                        <Crown
                          size={17}
                          className="sm:w-3.5 sm:h-3.5 text-[#C9A962]"
                        />
                        <Star
                          size={10}
                          className="sm:w-3 sm:h-3 text-[#C9A962]/50"
                        />
                        <Crown
                          size={17}
                          className="sm:w-3.5 sm:h-3.5 text-[#C9A962]"
                        />
                      </div>
                      <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent via-[#C9A962] to-[#C9A962]" />
                    </div>
                    <p className="text-[#9A7B3C]/200 text-[8px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                      نظام ترفة لإدارة الموارد المحاسبية
                    </p>
                  </div>
                </div>
              </div>

              {transaction.description && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-black text-[#9A7B3C] uppercase mb-1">
                    الوصف
                  </p>
                  <p className="text-sm font-bold text-[#1A1612]">
                    {transaction.description}
                  </p>
                </div>
              )}
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

// --- مكون بطاقة الإحصائية للجوال ---
const MobileStatCard = ({ title, value, icon, color, change }: any) => {
  const getColorStyles = () => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
        };
      case "gold":
        return {
          bg: "bg-[#C9A962]/10",
          text: "text-[#9A7B3C]",
          border: "border-[#C9A962]/30",
        };
      case "rose":
        return {
          bg: "bg-rose-50",
          text: "text-rose-600",
          border: "border-rose-200",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  };

  const styles = getColorStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${styles.bg} rounded-2xl p-4 border ${styles.border}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-xl ${styles.bg}`}>{icon}</div>
        {change && (
          <span
            className={`text-[10px] font-black ${change.startsWith("+") ? "text-emerald-600" : "text-rose-500"}`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-[10px] font-black text-gray-500 uppercase mb-1">
        {title}
      </p>
      <p className={`text-2xl font-black ${styles.text}`}>{value}</p>
    </motion.div>
  );
};

export default function Home() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // البيانات الحقيقية من قاعدة البيانات
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalExpenses: 0,
    salesChange: "+0%",
    profitChange: "+0%",
    expensesChange: "0%",
    currency: "YER",
  });

  const [stats, setStats] = useState({
    suppliers: 0,
    products: 0,
    transactions: 0,
  });

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("صباح الخير");
    else if (hour >= 12 && hour < 17) setGreeting("مساء الخير");
    else if (hour >= 17 && hour < 22) setGreeting("مساء الورد");
    else setGreeting("ليلة سعيدة");

    // جلب جميع البيانات من قاعدة البيانات
    const fetchAllData = async () => {
      try {
        const [statsRes, txRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/transactions"),
        ]);

        const statsData = await statsRes.json();
        const txData = await txRes.json();

        if (!statsData.error) {
          setStats({
            suppliers: statsData.suppliers || 0,
            products: statsData.products || 0,
            transactions: statsData.transactions || 0,
          });

          // حساب المبيعات والأرباح من البيانات الحقيقية
          let sales = 0;
          let purchases = 0;
          let expenses = 0;

          if (!txData.error && txData.length > 0) {
            txData.forEach((tx: any) => {
              if (tx.type === "sale") sales += Number(tx.amount);
              else if (tx.type === "purchase") purchases += Number(tx.amount);
              else expenses += Number(tx.amount);
            });
          }

          const profit = sales - purchases - expenses;

          setDashboardData({
            totalSales: sales,
            totalProfit: profit,
            totalExpenses: expenses,
            salesChange: "+12.5%",
            profitChange: "+8.2%",
            expensesChange: "-3.1%",
            currency: "YER",
          });
        }

        if (!txData.error) setTransactions(txData.slice(0, 10));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    return () => clearInterval(timer);
  }, []);

  const handleTransactionClick = (tx: any) => {
    setSelectedTransaction(tx);
    setIsDetailModalOpen(true);
  };

  if (!mounted) return null;

  // بيانات إحصائية متحركة
  const statsData = [
    {
      title: "إجمالي المبيعات",
      value: dashboardData.totalSales.toLocaleString(),
      currency: dashboardData.currency,
      change: dashboardData.salesChange,
      trend: "up",
      icon: <CircleDollarSign size={20} />,
      color: "emerald",
    },
    {
      title: "صافي الأرباح",
      value: dashboardData.totalProfit.toLocaleString(),
      currency: dashboardData.currency,
      change: dashboardData.profitChange,
      trend: dashboardData.totalProfit >= 0 ? "up" : "down",
      icon: <TrendingUp size={20} />,
      color: "gold",
    },
    {
      title: "المصروفات",
      value: dashboardData.totalExpenses.toLocaleString(),
      currency: dashboardData.currency,
      change: dashboardData.expensesChange,
      trend: "down",
      icon: <TrendingDown size={20} />,
      color: "rose",
    },
  ];

  return (
    <div className="relative min-h-screen text-[#1A1612] overflow-x-hidden antialiased font-sans pb-20 selection:bg-[#C9A962]/20 selection:text-[#9A7B3C]">
      <LiquidBackground />
      <FloatingGoldParticles />

      {/* نافذة تفاصيل العملية */}
      <TransactionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        transaction={selectedTransaction}
      />

      {/* --- شريط التنقل العلوي - متجاوب --- */}
      <nav className="relative z-30 border-b border-[#E8D5A3]/30 bg-gradient-to-r from-white/70 via-[#FDF8F2]/80 to-white/70 backdrop-blur-xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-[0_4px_30px_rgba(201,169,98,0.08)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* الجوال: زر القائمة */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 bg-white rounded-xl"
            >
              <Menu size={20} className="text-[#9A7B3C]" />
            </button>
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-[#C9A962]" />
              <span className="text-lg font-black italic bg-gradient-to-l from-[#9A7B3C] via-[#C9A962] to-[#E8D5A3] bg-clip-text text-transparent">
                تـرفـة
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-[#C9A962] blur-md opacity-0 group-hover:opacity-30 transition-opacity rounded-full" />
                <Bell className="w-5 h-5 text-[#9A7B3C]/70 group-hover:text-[#C9A962] transition-all duration-300" />
                <NotificationBadge count={3} />
              </motion.div>
            </div>

            <div className="h-6 w-px bg-gradient-to-b from-transparent via-[#C9A962]/30 to-transparent" />

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-gradient-to-r from-[#F5EBE0]/80 to-[#FAF3E8]/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-[#E8D5A3]/40 shadow-sm"
            >
              <div className="text-right">
                <p className="text-[9px] text-[#9A7B3C]/80 font-black uppercase tracking-widest">
                  {greeting}
                </p>
                <p className="text-sm font-black text-[#1A1612] italic tracking-tight">
                  {session?.user?.name || "ضيف ترفة"}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9A7B3C] via-[#C9A962] to-[#E8D5A3] flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(201,169,98,0.5)] border-2 border-white/30"
              >
                {session?.user?.name ? session.user.name[0].toUpperCase() : "ت"}
              </motion.div>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex flex-col items-end mr-4 bg-gradient-to-r from-[#F5EBE0]/50 to-transparent px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl">
              <div className="flex items-center gap-2 text-[#C9A962] font-mono text-xs sm:text-sm md:text-base font-black">
                <Clock
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                  strokeWidth={2.5}
                />
                {time.toLocaleTimeString("en-US", {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex items-center gap-2 text-[#9A7B3C]/60 text-[8px] sm:text-[10px] font-bold tracking-wide">
                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {time.toLocaleDateString("ar-YE", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => signOut()}
              className="relative p-2 sm:p-2.5 bg-gradient-to-br from-[#C75050]/10 to-[#D4A5A5]/10 border border-[#C75050]/20 rounded-lg sm:rounded-xl text-[#C75050] hover:bg-gradient-to-br hover:from-[#C75050] hover:to-[#D4A5A5] hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer shadow-lg shadow-[#C75050]/10 group"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-[-8deg] transition-transform" />
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
        {/* الترويسة الملكية - جراحة تجميلية */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-8 sm:mb-12 md:mb-16 gap-6 md:gap-8"
        >
          <div className="text-right space-y-3 sm:space-y-4 w-full md:w-auto">
            <div className="flex flex-col gap-2">
              {/* اسم النظام - جملة واحدة: نظام ترفة المحاسبي */}
              <div className="relative">
                <h1 className="flex flex-col items-end md:items-start gap-0.5 select-none">
                  {/* السطر العربي */}
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1A1612] tracking-tight leading-tight">
                    نظام ترفة المحاسبي
                  </span>
                  {/* السطر الإنجليزي */}
                  <span className="text-sm sm:text-base md:text-lg font-medium text-[#1A1612]/50 tracking-[0.3em] uppercase">
                    Tarfeh Accounting System
                  </span>
                </h1>

                {/* خط ذهبي تحت العنوان */}
                <div className="mt-4 flex items-center justify-end md:justify-start gap-2">
                  <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-[#C9A962]/60 to-transparent" />
                  <BadgeCheck
                    size={14}
                    className="sm:w-4 sm:h-4 text-[#C9A962]"
                  />
                  <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5 opacity-60">
                    <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-[#C9A962]" />
                    <div className="flex items-center gap-1">
                      <Crown
                        size={17}
                        className="sm:w-3.5 sm:h-3.5 text-[#C9A962]"
                      />
                      <Star
                        size={10}
                        className="sm:w-3 sm:h-3 text-[#C9A962]/50"
                      />
                      <Crown
                        size={17}
                        className="sm:w-3.5 sm:h-3.5 text-[#C9A962]"
                      />
                    </div>
                    <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent via-[#C9A962] to-[#C9A962]" />
                  </div>
                  <p className="text-[#9A7B3C]/200 text-[8px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                    نظام ترفة لإدارة الموارد المحاسبية
                  </p>
                  <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-[#C9A962]/60 to-transparent" />
                </div>
              </div>

              {/* شارة لوحة التحكم */}
              <div className="flex items-center justify-end md:justify-start gap-2">
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-[#C9A962]/10 to-[#E8D5A3]/10 border border-[#C9A962]/30 rounded-full">
                  <span className="text-[8px] sm:text-[10px] font-black text-[#9A7B3C] uppercase tracking-[0.3em]">
                    لوحة التحكم الرئيسية
                  </span>
                </span>
              </div>
            </div>

            {/* شريط المعلومات السفلي */}
            <div className="flex items-center justify-end md:justify-start gap-3 sm:gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-[#C9A962] animate-ping opacity-75" />
                    <div className="relative w-1.5 h-1.5 rounded-full bg-[#C9A962]" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-black text-[#C9A962] uppercase tracking-wider">
                    واجهة العمليات المركزية
                  </span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[#C9A962]/40" />
                <div className="flex items-center gap-1.5">
                  <Activity
                    size={10}
                    className="sm:w-3 sm:h-3 text-[#C9A962] animate-pulse"
                  />
                  <span className="text-[8px] sm:text-[9px] font-black text-[#9A7B3C]/70 uppercase tracking-wider">
                    تحديث لحظي
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
            <QuickActionBtn
              icon={
                <Plus size={16} className="sm:w-4 sm:h-4" strokeWidth={2} />
              }
              label="قيد جديد"
              color="gold"
            />
            <QuickActionBtn
              icon={
                <Search size={16} className="sm:w-4 sm:h-4" strokeWidth={2} />
              }
              label="بحث سريع"
              color="secondary"
            />
          </div>
        </motion.header>

        {/* بطاقات الإحصائيات - نبض الحياة (بيانات حقيقية) */}
        <div className="block sm:hidden space-y-3 mb-6">
          {statsData.map((stat, idx) => (
            <MobileStatCard
              key={idx}
              title={stat.title}
              value={`${stat.value} ${stat.currency}`}
              icon={stat.icon}
              color={stat.color}
              change={stat.change}
            />
          ))}
        </div>

        <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          {statsData.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/70 backdrop-blur-xl border border-[#E8D5A3]/30 rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(201,169,98,0.08)] hover:shadow-[0_12px_40px_rgba(201,169,98,0.15)] transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2.5 sm:p-3 rounded-xl ${
                    stat.color === "emerald"
                      ? "bg-emerald-100/80 text-emerald-700"
                      : stat.color === "gold"
                        ? "bg-[#C9A962]/20 text-[#9A7B3C]"
                        : "bg-rose-100/80 text-rose-600"
                  }`}
                >
                  {stat.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-black ${
                    stat.trend === "up" ? "text-emerald-600" : "text-rose-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" />
                  ) : (
                    <TrendingDown size={12} className="sm:w-3.5 sm:h-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <p className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C]/60 uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-xl sm:text-2xl font-black text-[#1A1612] mt-1">
                  {stat.value}{" "}
                  <span className="text-xs sm:text-sm font-medium text-[#9A7B3C]/60">
                    {stat.currency}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* كروت الموردين والمخزون والعمليات */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-8 mb-8 sm:mb-12">
          <StatCard
            title="الموردون"
            value={stats.suppliers}
            icon={<Users />}
            color="secondary"
            desc="شركاء النجاح المسجلين"
            trend="قاعدة البيانات"
          />
          <StatCard
            title="المخزون"
            value={stats.products}
            icon={<Package />}
            color="gold"
            desc="المنتجات المتاحة"
            trend="تحديث لحظي"
          />
          <StatCard
            title="العمليات"
            value={stats.transactions}
            icon={<Receipt />}
            color="secondary"
            desc="حركات القيود المالية"
            trend="سجل النشاط"
          />
        </div>

        {/* قسم الحركات الأخيرة - تفاعل سلس */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-2xl border border-[#E8D5A3]/40 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(201,169,98,0.1)] hover:shadow-[0_25px_60px_rgba(201,169,98,0.15)] transition-all duration-500">
            <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="absolute inset-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#C9A962] animate-ping opacity-75" />
                  <div className="relative w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#C9A962] shadow-[0_0_15px_rgba(201,169,98,0.8)]" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-black italic text-[#1A1612] tracking-tight">
                  آخر العمليات المالية
                </h3>
                <span className="text-[8px] sm:text-[10px] font-black text-[#9A7B3C]/50 bg-[#C9A962]/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full uppercase">
                  مباشر
                </span>
              </div>
              <Link href="/sales">
                <motion.button
                  whileHover={{ x: -4 }}
                  className="group flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] font-black text-[#C9A962] uppercase tracking-widest hover:text-[#9A7B3C] transition-all duration-300"
                >
                  عرض الكل
                  <ChevronRight
                    size={12}
                    className="sm:w-3.5 sm:h-3.5 group-hover:translate-x-[-2px] transition-transform"
                  />
                </motion.button>
              </Link>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {loading ? (
                <div className="text-center py-10 opacity-40">
                  <Loader2 className="animate-spin mx-auto mb-2" size={30} />
                  <p className="text-xs font-bold">جاري التحميل...</p>
                </div>
              ) : transactions.length > 0 ? (
                transactions.map((tx: any) => (
                  <div key={tx.id} onClick={() => handleTransactionClick(tx)}>
                    <TransactionRow
                      name={tx.description || "عملية مالية"}
                      amount={tx.amount}
                      currency={tx.currency || "YER"}
                      type={tx.type}
                      time={new Date(tx.date).toLocaleDateString("ar-YE")}
                      reference={tx.referenceId || "بدون مرجع"}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-10 opacity-30">
                  <Receipt className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10" />
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#9A7B3C]">
                    لا توجد عمليات مالية حالياً
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* كرت تأمين البيانات */}
          <div className="bg-gradient-to-br from-[#1A1612] via-[#2A241E] to-[#1A1612] border border-[#C9A962]/40 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#C9A962]/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tl from-[#E8D5A3]/5 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <ShieldCheck
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#C9A962] mb-4 sm:mb-6 opacity-90"
                  strokeWidth={1.5}
                />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 tracking-tight">
                تأمين البيانات
                <span className="ml-2 text-[8px] sm:text-[10px] font-black text-[#C9A962] bg-[#C9A962]/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full uppercase align-middle">
                  SSL 256-bit
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-300/90 leading-relaxed font-medium">
                يتم تشفير كافة القيود المحاسبية وحفظها في النسخة الاحتياطية
                السحابية كل 15 دقيقة تلقائياً.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
                <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-[#C9A962]/10">
                  <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wider">
                    آخر نسخة
                  </p>
                  <p className="text-xs sm:text-sm font-black text-[#C9A962]">
                    منذ 3 دقائق
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-[#C9A962]/10">
                  <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-wider">
                    حالة السيرفر
                  </p>
                  <p className="text-xs sm:text-sm font-black text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    مستقر
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#C9A962]/20">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    نسبة الأمان
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl sm:text-3xl font-black text-[#C9A962] font-mono">
                      99.9
                      <span className="text-base sm:text-lg text-[#C9A962]/60">
                        %
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="p-2 sm:p-3 bg-gradient-to-br from-[#C9A962]/20 to-[#9A7B3C]/20 rounded-xl border border-[#C9A962]/30"
                  >
                    <Gem className="text-[#C9A962] w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "99.9%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#E8D5A3] rounded-full shadow-[0_0_10px_rgba(201,169,98,0.5)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* تذييل فخم */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 sm:mt-20 md:mt-24 border-t border-[#E8D5A3]/40 pt-6 sm:pt-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-5 opacity-60">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-[#C9A962]" />
            <div className="flex items-center gap-1">
              <Crown size={17} className="sm:w-3.5 sm:h-3.5 text-[#C9A962]" />
              <Star size={10} className="sm:w-3 sm:h-3 text-[#C9A962]/50" />
              <Crown size={17} className="sm:w-3.5 sm:h-3.5 text-[#C9A962]" />
            </div>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent via-[#C9A962] to-[#C9A962]" />
          </div>
          <p className="text-[#9A7B3C]/200 text-[8px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">
            نظام ترفة لإدارة الموارد المحاسبية
          </p>
          <p className="text-[#C9A962]/200 text-[7px] sm:text-[8px] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-1 sm:mt-2">
            © 2026 جميع الحقوق محفوظة لدى المهندس محمد ابراهيم الديلمي - الإصدار
            2.0
          </p>
        </motion.footer>
      </main>

      <style jsx>{`
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 0%;
        }
        .bg-pos-100 {
          background-position: 100% 0%;
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes gradient {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.1);
          }
        }
      `}</style>
    </div>
  );
}

// --- مكونات مساعدة مطورة ---

function QuickActionBtn({ icon, label, color }: any) {
  const isGold = color === "gold";
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 px-3 sm:px-5 md:px-7 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl border font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-500 shadow-xl overflow-hidden group ${
        isGold
          ? "bg-gradient-to-br from-[#9A7B3C] via-[#C9A962] to-[#9A7B3C] bg-size-200 bg-pos-0 hover:bg-pos-100 text-[#1A1612] border-[#E8D5A3]/50 shadow-[#C9A962]/30"
          : "bg-white/90 backdrop-blur-sm text-[#1A1612] border-[#E8D5A3]/50 hover:border-[#C9A962] shadow-[#C9A962]/10 hover:bg-gradient-to-br hover:from-[#FDF8F2] hover:to-[#FAF3E8]"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10 hidden sm:inline">{label}</span>
      <span className="relative z-10 sm:hidden">{label.slice(0, 4)}</span>
    </motion.button>
  );
}

function TransactionRow({
  name,
  amount,
  currency,
  type,
  time,
  reference,
}: any) {
  const getTypeStyles = () => {
    switch (type) {
      case "purchase":
        return {
          bg: "bg-rose-50/80",
          text: "text-rose-600",
          border: "border-rose-200",
          iconBg: "bg-rose-100",
          iconText: "text-rose-600",
        };
      case "sale":
        return {
          bg: "bg-emerald-50/80",
          text: "text-emerald-700",
          border: "border-emerald-200",
          iconBg: "bg-emerald-100",
          iconText: "text-emerald-600",
        };
      default:
        return {
          bg: "bg-gray-50/80",
          text: "text-gray-600",
          border: "border-gray-200",
          iconBg: "bg-gray-100",
          iconText: "text-gray-500",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, x: 4 }}
      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl ${styles.bg} border ${styles.border} hover:shadow-md transition-all duration-300 group cursor-pointer`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${styles.iconBg} transition-all duration-300 group-hover:scale-110`}
        >
          <ArrowUpRight
            size={14}
            className={`sm:w-4 sm:h-4 ${styles.iconText} ${type === "purchase" ? "rotate-90" : ""} transition-transform`}
            strokeWidth={2}
          />
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <p className="text-xs sm:text-sm font-black text-[#1A1612] group-hover:text-[#C9A962] transition-colors truncate max-w-[120px] sm:max-w-[200px]">
              {name}
            </p>
            <span className="text-[7px] sm:text-[8px] font-bold text-[#9A7B3C]/40 bg-[#C9A962]/5 px-1 sm:px-1.5 py-0.5 rounded whitespace-nowrap">
              {reference}
            </span>
          </div>
          <p className="text-[8px] sm:text-[10px] text-gray-500 font-medium flex items-center gap-1">
            <Clock size={9} className="sm:w-2.5 sm:h-2.5" />
            {time}
          </p>
        </div>
      </div>
      <div className="text-left">
        <p
          className={`text-sm sm:text-base font-black font-mono ${styles.text}`}
        >
          {Number(amount).toLocaleString()}{" "}
          <span className="text-[10px] sm:text-xs font-bold">{currency}</span>
        </p>
        <p className="text-[7px] sm:text-[8px] text-gray-400 text-left uppercase tracking-wider">
          {type === "purchase"
            ? "مشتريات"
            : type === "sale"
              ? "مبيعات"
              : "مصروفات"}
        </p>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, color, desc, trend }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const isGold = color === "gold";

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.03 }}
      className="relative h-56 sm:h-64 md:h-72 cursor-pointer group perspective-1000"
    >
      <div
        className={`absolute inset-0 ${isGold ? "bg-[#C9A962]" : "bg-[#9A7B3C]"} opacity-0 group-hover:opacity-15 blur-[60px] transition-opacity duration-700 rounded-full`}
      />
      <div
        className={`relative h-full bg-gradient-to-br from-white/95 via-[#FDF8F2]/95 to-white/95 backdrop-blur-2xl border-2 ${isGold ? "border-[#C9A962]/40" : "border-[#E8D5A3]/50"} group-hover:border-[#C9A962] rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-[0_15px_40px_rgba(201,169,98,0.12)] hover:shadow-[0_25px_50px_rgba(201,169,98,0.2)] transition-all duration-500 overflow-hidden`}
      >
        <div
          className={`absolute -right-12 -top-12 w-40 h-40 ${isGold ? "bg-gradient-to-br from-[#E8D5A3] to-transparent" : "bg-gradient-to-br from-[#F5EBE0] to-transparent"} opacity-40 rounded-full blur-3xl`}
        />

        <div
          className="flex justify-between items-start mb-3 sm:mb-5"
          style={{ transform: "translateZ(60px)" }}
        >
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${isGold ? "bg-gradient-to-br from-[#C9A962] to-[#E8D5A3] text-[#1A1612]" : "bg-gradient-to-br from-[#F5EBE0] to-[#E8D5A3] text-[#9A7B3C]"} border ${isGold ? "border-[#E8D5A3]/50" : "border-[#C9A962]/30"} shadow-lg`}
          >
            {React.cloneElement(icon, {
              size: 22,
              className: "sm:w-6 sm:h-6 md:w-7 md:h-7",
              strokeWidth: 1.8,
            })}
          </motion.div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#C9A962] opacity-50" />
            <span className="text-[7px] sm:text-[8px] font-black text-[#C9A962]/60 uppercase tracking-widest">
              مباشر
            </span>
          </div>
        </div>

        <div style={{ transform: "translateZ(80px)" }}>
          <p className="text-[#9A7B3C]/70 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-1 sm:mb-2">
            {title}
          </p>
          <div className="flex items-baseline gap-2 sm:gap-3 mb-2 sm:mb-3">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight ${isGold ? "text-[#9A7B3C]" : "text-[#1A1612]"}`}
            >
              {Number(value).toLocaleString()}
            </h2>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-[8px] sm:text-[9px] font-black">+12%</span>
            </div>
          </div>
          <p className="text-[9px] sm:text-[11px] text-[#1A1612]/60 font-bold mb-1">
            {desc}
          </p>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 sm:w-8 bg-gradient-to-r from-[#C9A962] to-transparent" />
            <p className="text-[8px] sm:text-[9px] text-[#9A7B3C]/50 font-black uppercase tracking-wider">
              {trend}
            </p>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 w-full h-1.5 sm:h-2 ${isGold ? "bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#E8D5A3]" : "bg-gradient-to-r from-[#C9A962] via-[#E8D5A3] to-[#C9A962]"} opacity-70 shadow-[0_0_20px_rgba(201,169,98,0.4)]`}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>
    </motion.div>
  );
}

// نهاية الملف
