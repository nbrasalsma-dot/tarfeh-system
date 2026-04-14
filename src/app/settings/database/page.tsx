"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Link as LinkIcon,
  ShieldCheck,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Globe,
  Trash2,
  RefreshCw,
  LayoutGrid,
  Home,
  Eye,
  EyeOff,
  Copy,
  Key,
  Server,
  Wifi,
  WifiOff,
  Activity,
  Clock,
  ChevronLeft,
  Menu,
  X,
  HardDrive,
  Zap,
  Radio,
  Fingerprint,
  Lock,
  Search,
  FileCode,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

// ✅ مكون بطاقة الاتصال للجوال
const MobileConnectionCard = ({ conn, onDelete }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-4 border border-[#E8D5A3]/30 shadow-sm"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#FAF3E8] to-[#F5EBE0] rounded-xl flex items-center justify-center text-[#9A7B3C] shrink-0">
          <LayoutGrid size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-[#1A1612] truncate">
            {conn.connectionName}
          </h3>
          <p className="text-[9px] text-gray-500 font-mono mt-0.5 truncate">
            ID: {conn.authFileId}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDelete(conn.id)}
            className="p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} className="text-gray-400 hover:text-rose-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#FDF8F2] p-2 rounded-xl">
          <p className="text-[8px] text-gray-400 font-black uppercase mb-1">
            الحالة
          </p>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
              conn.status === "ACTIVE"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {conn.status === "ACTIVE" ? (
              <Wifi size={10} />
            ) : (
              <WifiOff size={10} />
            )}
            {conn.status === "ACTIVE" ? "متصل" : "منفصل"}
          </span>
        </div>
        <div className="bg-[#FDF8F2] p-2 rounded-xl">
          <p className="text-[8px] text-gray-400 font-black uppercase mb-1">
            الجداول
          </p>
          <p className="text-sm font-black text-[#C9A962]">
            {conn.detectedTables?.length || 0}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function DatabaseSettingsPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [probeResult, setProbeResult] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);

  const [formData, setFormData] = useState({
    connectionName: "",
    databaseUrl: "",
    siteUrl: "",
    authFileId: "",
  });

  // 1. جلب الاتصالات الموجودة
  const fetchConnections = async () => {
    try {
      const res = await fetch("/api/settings/database");
      const data = await res.json();
      if (!data.error) setConnections(data);
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchConnections();
    const generatedId = `TARIFA-AUTH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setFormData((prev) => ({ ...prev, authFileId: generatedId }));
  }, []);

  // --- المرحلة 1: بدء الفحص والتشريح ---
  const handleStartProbe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // إرسال البيانات للفحص الأولي (بدون حفظ نهائي)
      const res = await fetch("/api/settings/database", {
        method: "POST",
        body: JSON.stringify({ ...formData, mode: "PROBE_ONLY" }),
      });
      const data = await res.json();

      if (res.ok) {
        setProbeResult(data);
        setCurrentStep(2);
        setSuccess("✅ المرحلة 1 نجحت: تم تشريح القاعدة واكتشاف البيانات.");
      } else {
        setError(data.error || "فشل الفحص الأولي.");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بمحرك الاستيطان.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- المرحلة 2: التحقق من زرع الكود في الموقع ---
  const handleVerifyPlanting = async () => {
    setIsVerifying(true);
    setError("");
    try {
      // محاكاة طلب التحقق من رابط الموقع
      // في الواقع سنرسل طلب Fetch لـ siteUrl ونبحث عن الهوية
      const res = await fetch(
        `/api/proxy?url=${encodeURIComponent(formData.siteUrl)}`,
      );
      const text = await res.text();

      if (text.includes(formData.authFileId)) {
        setIsVerified(true);
        setCurrentStep(3);
        setSuccess("✅ المرحلة 2 نجحت: تم العثور على مفتاح السيادة في موقعك.");
      } else {
        setError(
          "❌ لم يتم العثور على الكود المشفر في الموقع المستهدف. تأكد من زرعه بشكل صحيح.",
        );
      }
    } catch (err) {
      setError("تعذر الوصول للموقع المستهدف للتحقق.");
    } finally {
      setIsVerifying(false);
    }
  };

  // --- المرحلة 3: الاعتماد النهائي والحفظ ---
  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/settings/database", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          mode: "FINAL_CONFIRM",
          tables: probeResult.detectedTables,
        }),
      });
      if (res.ok) {
        setSuccess("👑 تم الاستيطان بنجاح! تم دمج القاعدة في الإمبراطورية.");
        setFormData({
          connectionName: "",
          databaseUrl: "",
          siteUrl: "",
          authFileId: "",
        });
        setCurrentStep(1);
        setProbeResult(null);
        setIsVerified(false);
        fetchConnections();
      }
    } catch (err) {
      setError("فشل الاعتماد النهائي.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConnection = async (id: string) => {
    if (!confirm("هل أنت متأكد من فك هذا الارتباط الاستيطاني؟")) return;
    try {
      const res = await fetch(`/api/settings/database?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchConnections();
    } catch (err) {
      console.error("خطأ في الحذف:", err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FDF8F2] text-[#1A1612] pb-20 font-sans">
      {/* Navbar Mobile */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E8D5A3]/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/settings">
            <ArrowRight size={20} />
          </Link>
          <h1 className="font-black italic">ترفة المحاسبي</h1>
          <Database size={20} className="text-[#C9A962]" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-[#1A1612] to-[#3A342E] rounded-2xl shadow-xl shadow-gold-500/10">
              <Database
                className="w-10 h-10 text-[#C9A962]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1A1612] tracking-tight">
                محرك الاستيطان{" "}
                <span className="text-[#C9A962] font-light">
                  | المعاملة الذكية
                </span>
              </h1>
              <p className="text-gray-500 font-bold mt-1 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                بروتوكول الربط السيادي الثلاثي مفعل وجاهز.
              </p>
            </div>
          </div>
        </div>

        {/* 🚀 السير الإجرائي للمراحل (Stepper) */}
        <div className="mb-10 bg-white border border-[#E8D5A3]/50 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
            <div
              className={`absolute top-1/2 left-0 h-0.5 bg-[#C9A962] -translate-y-1/2 z-0 transition-all duration-700`}
              style={{ width: `${(currentStep - 1) * 50}%` }}
            ></div>

            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 ${
                    currentStep >= s
                      ? "bg-[#C9A962] text-white scale-110 shadow-lg"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  {currentStep > s ? <CheckCircle2 size={20} /> : s}
                </div>
                <span
                  className={`text-[10px] font-black uppercase ${currentStep >= s ? "text-[#9A7B3C]" : "text-gray-400"}`}
                >
                  {s === 1
                    ? "1. التشريح"
                    : s === 2
                      ? "2. المصافحة"
                      : "3. السيادة"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Transaction Card */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {/* المرحلة 1: إدخال الروابط */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-[#E8D5A3]/20 relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-gold-50 rounded-lg text-[#9A7B3C]">
                      <Radio className="animate-pulse" />
                    </div>
                    <h2 className="text-xl font-black">
                      المرحلة الأولى: فحص الرادار
                    </h2>
                  </div>

                  <form onSubmit={handleStartProbe} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-[#9A7B3C] uppercase mb-2 block">
                        اسم المتجر / العميل
                      </label>
                      <input
                        required
                        value={formData.connectionName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            connectionName: e.target.value,
                          })
                        }
                        className="w-full bg-[#FDFBF7] border border-[#E8D5A3]/30 rounded-2xl px-5 py-4 focus:border-[#C9A962] outline-none font-bold text-sm"
                        placeholder="مثلاً: متجر ترفة الرئيسي"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#9A7B3C] uppercase mb-2 block">
                        رابط قاعدة البيانات
                      </label>
                      <input
                        required
                        type="password"
                        dir="ltr"
                        value={formData.databaseUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            databaseUrl: e.target.value,
                          })
                        }
                        className="w-full bg-[#FDFBF7] border border-[#E8D5A3]/30 rounded-2xl px-5 py-4 focus:border-[#C9A962] outline-none font-bold text-sm"
                        placeholder="postgresql://..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#9A7B3C] uppercase mb-2 block">
                        رابط الموقع (URL)
                      </label>
                      <input
                        required
                        type="url"
                        dir="ltr"
                        value={formData.siteUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, siteUrl: e.target.value })
                        }
                        className="w-full bg-[#FDFBF7] border border-[#E8D5A3]/30 rounded-2xl px-5 py-4 focus:border-[#C9A962] outline-none font-bold text-sm"
                        placeholder="https://tarfeh.com"
                      />
                    </div>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full bg-[#1A1612] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Search size={20} />
                      )}
                      بدء عملية التشريح
                    </button>
                  </form>
                </motion.div>
              )}

              {/* المرحلة 2: زرع الهوية والتحقق */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-dashed border-[#C9A962]/30"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Fingerprint />
                    </div>
                    <h2 className="text-xl font-black">
                      المرحلة الثانية: زرع هوية ترفة
                    </h2>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mb-6">
                    <p className="text-xs font-bold text-amber-800 mb-4 leading-relaxed">
                      يجب عليك الآن زرع هذا الكود داخل ملف{" "}
                      <code className="bg-white px-2 py-0.5 rounded">
                        tarifa.auth
                      </code>{" "}
                      في المجلد الرئيسي لموقع المشتري.
                    </p>
                    <div className="bg-white p-4 rounded-xl flex items-center justify-between border border-[#C9A962]/20">
                      <code className="text-sm font-black tracking-widest">
                        {formData.authFileId}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(formData.authFileId);
                          setSuccess("تم النسخ!");
                        }}
                        className="text-[#C9A962] hover:scale-110 transition-transform"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleVerifyPlanting}
                      disabled={isVerifying}
                      className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
                    >
                      {isVerifying ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Wifi size={20} />
                      )}
                      تحقق من نجاح الزراعة (Ping)
                    </button>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="w-full text-gray-400 text-xs font-black uppercase"
                    >
                      رجوع للخطوة السابقة
                    </button>
                  </div>
                </motion.div>
              )}

              {/* المرحلة 3: التقرير والاعتماد النهائي */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-emerald-500/20"
                >
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                      <ShieldCheck size={40} className="text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-[#1A1612]">
                      جاهز للاستيطان النهائي
                    </h2>
                    <p className="text-gray-500 text-sm font-bold mt-2">
                      تم التحقق من كافة المسارات والبيانات.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-5 space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">
                        عدد الجداول المكتشفة:
                      </span>
                      <span className="font-black text-[#C9A962]">
                        {probeResult?.tablesCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">نسبة التطابق:</span>
                      <span className="font-black text-emerald-600">
                        100% (سيادي)
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">رابط الموقع:</span>
                      <span className="font-mono text-[10px] truncate max-w-[150px]">
                        {formData.siteUrl}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleFinalConfirm}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#C9A962] to-[#9A7B3C] text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-gold-500/40 hover:brightness-110 transition-all flex items-center justify-center gap-4"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Lock size={24} />
                    )}
                    إتمام الاستيطان والارتباط
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar: Connections List */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="font-black text-lg flex items-center gap-2">
                <Globe className="text-[#C9A962]" /> المواقع المستوطنة
              </h2>
              <button
                onClick={fetchConnections}
                className="p-2 bg-white rounded-xl shadow-sm hover:rotate-180 transition-all duration-700 text-gray-400"
              >
                <RefreshCw size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full py-20 text-center opacity-20">
                  <Loader2 className="mx-auto animate-spin" size={40} />
                </div>
              ) : connections.length === 0 ? (
                <div className="col-span-full py-20 bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center text-gray-400 font-bold">
                  لا يوجد ارتباطات حالياً
                </div>
              ) : (
                connections.map((c) => (
                  <motion.div
                    key={c.id}
                    layout
                    className="bg-white p-5 rounded-3xl shadow-sm border border-[#E8D5A3]/20 hover:shadow-xl transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#C9A962] group-hover:bg-[#C9A962] group-hover:text-white transition-all">
                        <Server size={24} />
                      </div>
                      <button
                        onClick={() => handleDeleteConnection(c.id)}
                        className="text-gray-200 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h3 className="font-black text-sm truncate">
                      {c.connectionName}
                    </h3>
                    <div className="mt-3 flex items-center gap-3">
                      <span
                        className={`text-[9px] font-black px-2 py-1 rounded-lg ${c.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                      >
                        {c.status === "ACTIVE" ? "نشط" : "خامل"}
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">
                        Tables: {c.detectedTables?.length || 0}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Global Alerts */}
            <AnimatePresence>
              {(error || success) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-5 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-xl ${error ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}`}
                >
                  {error ? <ShieldAlert /> : <CheckCircle2 />}
                  {error || success}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-white border border-[#E8D5A3]/30 rounded-[2rem] flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-gold-50 rounded-2xl">
            <ShieldCheck className="text-[#C9A962]" />
          </div>
          <div>
            <p className="text-xs font-black text-[#1A1612]">
              الأمان والسيادة الرقمية
            </p>
            <p className="text-[10px] text-gray-500 font-bold leading-relaxed mt-1">
              يتم حماية جميع الارتباطات عبر قناة مشفرة بالكامل. الهوية الرقمية
              المزرعة تمنع تداخل أي أنظمة أخرى مع ممتلكات ترفة المحاسبية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
