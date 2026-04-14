"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Database,
  Coins,
  Users,
  ShieldCheck,
  ArrowRight,
  Home,
  HardDrive,
  ChevronLeft,
  Bell,
  Menu,
  X,
  Lock,
  Globe,
  CreditCard,
  History,
  Activity,
  Server,
  Key,
  UserPlus,
  Building,
  Store,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SystemSettings() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [lastBackup, setLastBackup] = useState("2026-04-11 23:30");
  const [systemStatus, setSystemStatus] = useState({
    database: true,
    api: true,
    storage: true,
  });

  useEffect(() => {
    setMounted(true);

    // جلب بيانات النظام الحية من العقل المدبر
    const fetchSystemData = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();

        if (!data.error) {
          // تحديث الحالة بناءً على رد السيرفر الحقيقي
          setSystemStatus(data.systemStatus);
          setLastBackup(data.lastBackup);
        }
      } catch (error) {
        console.error("🔥 خطأ في جلب بيانات الإعدادات:", error);
      }
    };

    fetchSystemData();
  }, []);

  if (!mounted) return null;

  // مصفوفة كروت الإعدادات
  const settingsCards = [
    {
      title: "الاستيطان وقواعد البيانات",
      shortTitle: "قواعد البيانات",
      description: "إدارة الربط، توليد الهويات المشفرة، والتحكم بالوصول.",
      shortDescription: "الربط والهويات المشفرة",
      icon: <Database className="w-5 h-5 sm:w-6 sm:h-6 text-[#9A7B3C]" />,
      path: "/settings/database",
      status: "متصل",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      badge: "أساسي",
    },
    {
      title: "إدارة الصرف والعملات",
      shortTitle: "العملات والصرف",
      description: "تحديث أسعار الصرف، العملة الافتراضية، ومحرك التحويل.",
      shortDescription: "أسعار الصرف والتحويل",
      icon: <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-[#9A7B3C]" />,
      path: "/settings/currency",
      status: "مفعل",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      badge: "مالي",
    },
    {
      title: "الموظفين والصلاحيات",
      shortTitle: "الموظفين",
      description: "إدارة الأدوار، إضافة مستخدمين، ومراقبة النشاط.",
      shortDescription: "الأدوار والمستخدمين",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#9A7B3C]" />,
      path: "/settings/users",
      status: "قريباً",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200",
      badge: "قادم",
    },
    {
      title: "رخصة النظام والنسخ الاحتياطي",
      shortTitle: "الرخصة والنسخ",
      description: "تفاصيل الاشتراك، استخراج النسخ الاحتياطية (SQL/JSON).",
      shortDescription: "الاشتراك والنسخ الاحتياطي",
      icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#9A7B3C]" />,
      path: "/settings/license",
      status: "نشط",
      statusColor: "text-[#9A7B3C] bg-[#C9A962]/10 border-[#C9A962]/30",
      badge: "حماية",
    },
    {
      title: "إعدادات المتجر العامة",
      shortTitle: "المتجر",
      description: "اسم المتجر، الشعار، معلومات الاتصال، والضرائب.",
      shortDescription: "هوية المتجر ومعلوماته",
      icon: <Store className="w-5 h-5 sm:w-6 sm:h-6 text-[#9A7B3C]" />,
      path: "/settings/store",
      status: "مكتمل",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      badge: "عام",
    },
    {
      title: "سجل النشاطات والمراقبة",
      shortTitle: "سجل النشاط",
      description: "مراقبة عمليات الدخول، التعديلات، والأحداث الهامة.",
      shortDescription: "سجل الأحداث والمراقبة",
      icon: <History className="w-5 h-5 sm:w-6 sm:h-6 text-[#9A7B3C]" />,
      path: "/settings/audit",
      status: "نشط",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      badge: "أمان",
    },
  ];

  // بطاقات الحالة السريعة للجوال
  const quickStats = [
    {
      label: "قاعدة البيانات",
      status: systemStatus.database,
      icon: <Database size={14} />,
    },
    { label: "API", status: systemStatus.api, icon: <Server size={14} /> },
    {
      label: "التخزين",
      status: systemStatus.storage,
      icon: <HardDrive size={14} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] text-[#1A1612] selection:bg-[#C9A962]/20 selection:text-[#9A7B3C]">
      {/* شريط التنقل للجوال - مطور */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#E8D5A3]/30 px-3 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors">
                <ArrowRight size={18} />
              </button>
            </Link>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors">
              <Home size={18} />
            </button>
          </div>
          <h1 className="text-base font-black italic text-[#1A1612]">
            الإعدادات
          </h1>
          <button className="p-2 bg-gray-100 rounded-xl text-gray-600 relative">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
        {/* الترويسة الرئيسية */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="p-2.5 sm:p-3 md:p-4 bg-gradient-to-br from-[#F5EBE0] to-[#E8D5A3] rounded-xl sm:rounded-2xl shadow-sm border border-[#C9A962]/20">
                <Settings
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#9A7B3C]"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1612]">
                  مركز التحكم{" "}
                  <span className="text-[#C9A962] font-light text-lg sm:text-xl md:text-2xl">
                    | الإعدادات
                  </span>
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-bold text-[#1A1612]/50 mt-1 sm:mt-2 flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]" />
                  <span className="hidden sm:inline">
                    السيطرة الكاملة على محركات النظام، الربط، والصلاحيات.
                  </span>
                  <span className="sm:hidden">التحكم الكامل بالنظام</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* بطاقات الحالة السريعة للجوال */}
        <div className="lg:hidden grid grid-cols-3 gap-2 mb-4">
          {quickStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-2.5 border border-[#E8D5A3]/30"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#9A7B3C]">{stat.icon}</span>
                <div
                  className={`w-2 h-2 rounded-full ${stat.status ? "bg-emerald-500" : "bg-rose-500"} animate-pulse`}
                />
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase">
                {stat.label}
              </p>
              <p className="text-xs font-bold text-[#1A1612]">
                {stat.status ? "متصل" : "منفصل"}
              </p>
            </div>
          ))}
        </div>

        {/* معلومات النسخ الاحتياطي للجوال */}
        <div className="lg:hidden mb-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E8D5A3]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={14} className="text-[#C9A962]" />
              <span className="text-[10px] font-black text-gray-500 uppercase">
                آخر نسخة احتياطية
              </span>
            </div>
            <span className="text-xs font-bold text-[#1A1612]">
              {lastBackup}
            </span>
          </div>
        </div>

        {/* شبكة الكروت (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {settingsCards.map((card, index) => (
            <Link href={card.path} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white/80 backdrop-blur-xl border border-[#E8D5A3]/50 hover:border-[#C9A962] rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_10px_30px_rgba(201,169,98,0.05)] hover:shadow-[0_15px_40px_rgba(201,169,98,0.12)] transition-all duration-500 cursor-pointer h-full relative overflow-hidden"
              >
                {/* تأثير الإضاءة عند التمرير */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="flex items-start justify-between mb-3 sm:mb-4 relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 md:p-3 bg-[#C9A962]/10 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-500">
                      {card.icon}
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1A1612]/5 text-[#1A1612]/50">
                      {card.badge}
                    </span>
                  </div>
                  <span
                    className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border ${card.statusColor}`}
                  >
                    {card.status}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#1A1612] mb-1 sm:mb-2">
                    <span className="hidden sm:inline">{card.title}</span>
                    <span className="sm:hidden">{card.shortTitle}</span>
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#1A1612]/60 leading-relaxed mb-4 sm:mb-6">
                    <span className="hidden sm:inline">{card.description}</span>
                    <span className="sm:hidden">{card.shortDescription}</span>
                  </p>
                </div>

                <div className="flex justify-end relative z-10 mt-auto pt-3 sm:pt-4 border-t border-[#E8D5A3]/30">
                  <div className="flex items-center gap-1 sm:gap-2 text-[#C9A962] font-black text-[10px] sm:text-xs group-hover:text-[#9A7B3C] transition-colors">
                    <span className="hidden sm:inline">الدخول للإعدادات</span>
                    <span className="sm:hidden">دخول</span>
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* تذييل - معلومات إضافية للكمبيوتر */}
        <div className="hidden lg:block mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#E8D5A3]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    حالة النظام
                  </p>
                  <p className="text-sm font-bold text-emerald-600">
                    جميع الخدمات تعمل
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-[#E8D5A3]" />
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#C9A962]" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    آخر نسخة احتياطية
                  </p>
                  <p className="text-sm font-bold text-[#1A1612]">
                    {lastBackup}
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-[#E8D5A3]" />
              <div className="flex items-center gap-2">
                <Key size={16} className="text-[#C9A962]" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    الترخيص
                  </p>
                  <p className="text-sm font-bold text-[#1A1612]">
                    ساري حتى 2026-12-31
                  </p>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#C9A962]/10 hover:bg-[#C9A962]/20 rounded-xl text-[#9A7B3C] text-xs font-black transition-colors">
              <RefreshCw size={14} />
              تحديث الحالة
            </button>
          </div>
        </div>

        {/* معلومات الترخيص للجوال */}
        <div className="lg:hidden mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E8D5A3]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key size={14} className="text-[#C9A962]" />
              <span className="text-[10px] font-black text-gray-500 uppercase">
                الترخيص
              </span>
            </div>
            <span className="text-xs font-bold text-[#1A1612]">
              ساري حتى 2026-12-31
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
