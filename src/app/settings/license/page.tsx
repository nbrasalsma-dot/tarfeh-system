"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ArrowRight,
  Home,
  Download,
  Key,
  Calendar,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Database,
  CloudLightning,
  Lock,
  Copy,
  Eye,
  EyeOff,
  Clock,
  Server,
  Wifi,
  WifiOff,
  Activity,
  FileJson,
  FileText,
  Save,
  X,
  ChevronRight,
  Info,
  AlertTriangle,
  Zap,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function LicenseSettings() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupComplete, setBackupComplete] = useState(false);
  const [showLicenseKey, setShowLicenseKey] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [backupFormat, setBackupFormat] = useState<"sql" | "json">("sql");
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [error, setError] = useState("");

  // ✅ بيانات الرخصة الحقيقية من API
  const [licenseData, setLicenseData] = useState({
    status: "",
    owner: "",
    key: "",
    plan: "",
    activationDate: "",
    expiryDate: "",
    supportUntil: "",
    lastBackup: "لم يتم النسخ بعد",
    databaseSize: "",
    tables: 0,
    records: 0,
    version: "",
  });

  // ✅ جلب البيانات الحقيقية من API
  useEffect(() => {
    const fetchLicenseData = async () => {
      try {
        const response = await fetch("/api/settings/license");
        const data = await response.json();

        if (!data.error) {
          setLicenseData({
            status: data.status || "غير معروف",
            owner: data.owner || "غير محدد",
            key: data.key || "",
            plan: data.plan || "الباقة الأساسية",
            activationDate: data.activationDate || "",
            expiryDate: data.expiryDate || "",
            supportUntil: data.supportUntil || data.expiryDate || "",
            lastBackup: data.lastBackup || "لم يتم النسخ بعد",
            databaseSize: data.databaseSize || "0 MB",
            tables: data.tables || 0,
            records: data.records || 0,
            version: data.version || "1.0.0",
          });
        } else {
          setError(data.message || "فشل جلب البيانات");
        }
      } catch (err) {
        console.error("خطأ في جلب بيانات الرخصة:", err);
        setError("فشل الاتصال بالسيرفر");
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    fetchLicenseData();
  }, []);

  // ✅ النسخ الاحتياطي الحقيقي
  const handleBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    setBackupComplete(false);
    setError("");

    // محاكاة تقدم التحميل
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 300);

    try {
      const response = await fetch("/api/settings/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: backupFormat }),
      });

      clearInterval(interval);

      if (response.ok) {
        setBackupProgress(100);
        setBackupComplete(true);

        // تحديث تاريخ آخر نسخة
        setLicenseData((prev) => ({
          ...prev,
          lastBackup: "الآن",
        }));

        // ✅ تحميل الملف مباشرة من الاستجابة
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tarfeh_backup_${new Date().toISOString().split("T")[0]}.${backupFormat}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setTimeout(() => setBackupComplete(false), 5000);
      } else {
        const data = await response.json();
        setError(data.message || "فشل إنشاء النسخة الاحتياطية");
      }
    } catch (err) {
      console.error("خطأ في النسخ الاحتياطي:", err);
      setError("فشل الاتصال بالسيرفر");
      clearInterval(interval);
    } finally {
      setIsBackingUp(false);
    }
  };

  const copyLicenseKey = () => {
    if (licenseData.key) {
      navigator.clipboard.writeText(licenseData.key);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // ✅ شاشة تحميل أثناء جلب البيانات
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 w-10 h-10 text-[#C9A962]" />
          <p className="text-sm font-black text-[#1A1612]/50 uppercase tracking-widest">
            جاري تحميل بيانات الترخيص...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] text-[#1A1612] selection:bg-[#C9A962]/20 selection:text-[#9A7B3C] pb-20">
      {/* شريط التنقل للجوال - مطور */}
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
            الرخصة والنسخ
          </h1>
          <button
            onClick={handleBackup}
            disabled={isBackingUp}
            className="p-2 bg-[#C9A962] rounded-xl text-white shadow-md shadow-[#C9A962]/20"
          >
            {isBackingUp ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
          </button>
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
              <ShieldCheck
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#9A7B3C]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#1A1612]">
                رخصة النظام{" "}
                <span className="text-[#C9A962] font-light text-lg sm:text-xl md:text-2xl">
                  | النسخ الاحتياطي
                </span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#1A1612]/50 mt-1 sm:mt-2 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]" />
                <span className="hidden sm:inline">
                  إدارة الاشتراك، الحماية، واستخراج بياناتك بأمان.
                </span>
                <span className="sm:hidden">الاشتراك والحماية والنسخ</span>
              </p>
            </div>
          </motion.div>

          <div className="hidden sm:flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                licenseData.status === "نشط"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              <CheckCircle2 size={14} />
              {licenseData.status}
            </span>
          </div>
        </div>

        {/* رسالة خطأ */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700"
            >
              <AlertCircle size={16} />
              <span className="text-xs sm:text-sm font-bold">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* حالة الترخيص للجوال */}
        <div
          className={`sm:hidden mb-4 p-3 border rounded-xl flex items-center justify-between ${
            licenseData.status === "نشط"
              ? "bg-emerald-50 border-emerald-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={16}
              className={
                licenseData.status === "نشط"
                  ? "text-emerald-600"
                  : "text-amber-600"
              }
            />
            <span
              className={`text-sm font-black ${
                licenseData.status === "نشط"
                  ? "text-emerald-700"
                  : "text-amber-700"
              }`}
            >
              الترخيص {licenseData.status}
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-600">
            {licenseData.plan}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* العمود الأول: تفاصيل الرخصة */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl border border-[#E8D5A3]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_15px_40px_rgba(201,169,98,0.05)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C9A962]/10 to-transparent rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-[#E8D5A3]/30 pb-3 sm:pb-4 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-[#C9A962]/10 rounded-lg">
                  <Key className="w-4 h-4 sm:w-5 sm:h-5 text-[#9A7B3C]" />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1A1612]">
                  معلومات الترخيص
                </h2>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5 relative z-10">
              <div>
                <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-1">
                  المالك المسجل
                </p>
                <p className="text-base sm:text-lg font-black text-[#1A1612]">
                  {licenseData.owner || "غير محدد"}
                </p>
              </div>

              <div>
                <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase mb-1">
                  الباقة الحالية
                </p>
                <p className="text-sm sm:text-base font-bold text-[#1A1612] flex items-center gap-2">
                  <CloudLightning
                    size={14}
                    className="sm:w-4 sm:h-4 text-[#C9A962]"
                  />
                  {licenseData.plan || "الباقة الأساسية"}
                </p>
              </div>

              <div className="p-3 sm:p-4 bg-[#FDF8F2] border border-[#E8D5A3]/50 rounded-xl sm:rounded-2xl">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase">
                    مفتاح الترخيص
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowLicenseKey(!showLicenseKey)}
                      className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {showLicenseKey ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                    <button
                      onClick={copyLicenseKey}
                      className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {isCopied ? (
                        <CheckCircle2 size={14} className="text-emerald-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-mono font-bold text-[#1A1612] tracking-widest break-all select-all">
                  {showLicenseKey
                    ? licenseData.key
                    : licenseData.key
                      ? licenseData.key.slice(0, 12) + "●●●●-●●●●-●●●●"
                      : "TRF-2024-●●●●-●●●●-●●●●"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-white border border-gray-100 rounded-xl">
                  <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1.5">
                    <Calendar size={11} className="sm:w-3 sm:h-3" />
                    تاريخ التفعيل
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-[#1A1612]">
                    {licenseData.activationDate || "غير محدد"}
                  </p>
                </div>
                <div className="p-2.5 sm:p-3 bg-white border border-gray-100 rounded-xl">
                  <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1.5">
                    <AlertCircle size={11} className="sm:w-3 sm:h-3" />
                    تاريخ الانتهاء
                  </p>
                  <p
                    className={`text-xs sm:text-sm font-black ${
                      licenseData.expiryDate === "2099-12-31"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {licenseData.expiryDate || "غير محدد"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 bg-gray-50 rounded-xl text-center">
                  <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase">
                    الإصدار
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-[#1A1612]">
                    {licenseData.version || "1.0.0"}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 bg-gray-50 rounded-xl text-center">
                  <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase">
                    الجداول
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-[#1A1612]">
                    {licenseData.tables || 0}
                  </p>
                </div>
                <div className="p-2 sm:p-2.5 bg-gray-50 rounded-xl text-center">
                  <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase">
                    السجلات
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-[#1A1612]">
                    {typeof licenseData.records === "number"
                      ? licenseData.records.toLocaleString()
                      : licenseData.records || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* العمود الثاني: النسخ الاحتياطي */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-[#1A1612] to-[#2A241E] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(26,22,18,0.2)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
              <div
                className="absolute top-1/2 left-1/2 w-48 sm:w-64 h-48 sm:h-64 border border-[#C9A962] rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"
                style={{ animationDuration: "4s" }}
              />
            </div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 border-b border-white/10 pb-3 sm:pb-4">
                <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A962]" />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-white">
                  النسخ الاحتياطي (Backup)
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6 flex-1">
                <p className="text-xs sm:text-sm text-gray-300 font-bold leading-relaxed">
                  حمل نسخة احتياطية كاملة من قاعدة بياناتك (المبيعات، المخزون،
                  الموردين) بصيغة{" "}
                  <span className="text-[#C9A962]">SQL / JSON</span> لضمان أمان
                  بياناتك.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white/5 border border-white/10 p-2.5 sm:p-3 rounded-xl">
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1.5">
                      <HardDrive size={11} className="sm:w-3 sm:h-3" />
                      حجم القاعدة
                    </p>
                    <p className="text-base sm:text-lg font-black text-white font-mono">
                      {licenseData.databaseSize || "0 MB"}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-2.5 sm:p-3 rounded-xl">
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1.5">
                      <Clock size={11} className="sm:w-3 sm:h-3" />
                      آخر نسخة
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-white mt-1">
                      {licenseData.lastBackup || "لم يتم النسخ بعد"}
                    </p>
                  </div>
                </div>

                {/* معلومات إضافية للجوال */}
                <div className="sm:hidden grid grid-cols-2 gap-2">
                  <div className="bg-white/5 border border-white/10 p-2 rounded-lg">
                    <p className="text-[8px] font-black text-gray-400 uppercase">
                      الجداول
                    </p>
                    <p className="text-sm font-bold text-white">
                      {licenseData.tables || 0}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-2 rounded-lg">
                    <p className="text-[8px] font-black text-gray-400 uppercase">
                      السجلات
                    </p>
                    <p className="text-sm font-bold text-white">
                      {typeof licenseData.records === "number"
                        ? licenseData.records.toLocaleString()
                        : licenseData.records || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4 sm:pt-6">
                  {backupComplete ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-500/20 border border-emerald-500/50 p-3 sm:p-4 rounded-xl flex items-center gap-3 text-emerald-400"
                    >
                      <CheckCircle2
                        size={20}
                        className="sm:w-6 sm:h-6 shrink-0"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-black">
                          تم تصدير النسخة بنجاح!
                        </p>
                        <p className="text-[9px] sm:text-[10px] font-bold opacity-80 mt-0.5">
                          تم تحميل الملف إلى جهازك (tarfeh_backup.{backupFormat}
                          )
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {/* اختيار الصيغة */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setBackupFormat("sql")}
                          className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-black transition-all ${
                            backupFormat === "sql"
                              ? "bg-[#C9A962] text-[#1A1612]"
                              : "bg-white/10 text-gray-400 hover:bg-white/20"
                          }`}
                        >
                          <FileText size={12} className="inline mr-1" />
                          SQL
                        </button>
                        <button
                          onClick={() => setBackupFormat("json")}
                          className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-black transition-all ${
                            backupFormat === "json"
                              ? "bg-[#C9A962] text-[#1A1612]"
                              : "bg-white/10 text-gray-400 hover:bg-white/20"
                          }`}
                        >
                          <FileJson size={12} className="inline mr-1" />
                          JSON
                        </button>
                      </div>

                      {isBackingUp && (
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-[#C9A962] to-[#9A7B3C] h-full"
                            style={{ width: `${backupProgress}%` }}
                          />
                        </div>
                      )}
                      <button
                        onClick={handleBackup}
                        disabled={isBackingUp}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#9A7B3C] hover:from-[#C9A962] hover:to-[#E8D5A3] text-[#1A1612] px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-black text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-[#C9A962]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isBackingUp ? (
                          <>
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            جاري التصدير... {backupProgress}%
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                            استخراج نسخة احتياطية ({backupFormat.toUpperCase()})
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* تذييل - معلومات إضافية */}
        <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-[#E8D5A3]/30">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-[#C9A962]/10 rounded-lg shrink-0">
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9A7B3C]" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-[#1A1612]/60">
                <span className="font-black text-[#9A7B3C]">تنبيه:</span> يوصى
                بعمل نسخة احتياطية أسبوعياً. النسخة تحتوي على جميع بياناتك
                (المبيعات، المخزون، الموردين، الإعدادات).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
