"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  TrendingUp,
  RefreshCcw,
  Save,
  ArrowRight,
  DollarSign,
  History,
  ShieldCheck,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wallet,
  Banknote,
  CircleDollarSign,
  ChevronLeft,
  Calendar,
  Clock,
  Edit,
  Home,
  Settings,
  X,
  Eye,
} from "lucide-react";
import Link from "next/link";

// --- مكون بطاقة العملة للجوال ---
const MobileCurrencyCard = ({ currency, code, flag, rate, onUpdate }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newRate, setNewRate] = useState(rate);

  const handleSave = () => {
    onUpdate(code, newRate);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-4 border border-[#E8D5A3]/30 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FAF3E8] to-[#F5EBE0] rounded-xl flex items-center justify-center text-2xl">
            {flag}
          </div>
          <div>
            <h3 className="font-black text-base text-[#1A1612]">{currency}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              {code}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 bg-gray-100 rounded-lg"
        >
          <Edit size={14} className="text-gray-500" />
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-[9px] font-black text-[#9A7B3C] uppercase">
              سعر الصرف مقابل YER
            </label>
            <input
              type="number"
              step="0.01"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              className="w-full bg-[#FDF8F2] border border-[#E8D5A3]/30 rounded-xl px-3 py-2 text-lg font-black text-[#C9A962] outline-none focus:border-[#C9A962]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-[#C9A962] text-white rounded-xl text-xs font-black"
            >
              حفظ
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#FDF8F2] p-3 rounded-xl">
          <p className="text-[8px] text-gray-400 font-black uppercase mb-1">
            سعر الصرف الحالي
          </p>
          <p className="text-2xl font-black text-[#C9A962]">
            1 {code} = {rate} <span className="text-sm text-gray-400">YER</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

// --- مكون سجل التحديث للجوال ---
const MobileHistoryItem = ({ item }: any) => {
  return (
    <div className="bg-[#FDF8F2] rounded-xl p-3 border border-[#E8D5A3]/20">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#C9A962] font-black text-xs">
            {item.code}
          </div>
          <div>
            <p className="text-xs font-black text-[#1A1612]">{item.action}</p>
            <p className="text-[8px] text-gray-400">{item.user}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-[#C9A962]">
          {item.value}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[8px] text-gray-400">
        <Clock size={10} />
        <span>{item.time}</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <Calendar size={10} />
        <span>{item.date}</span>
      </div>
    </div>
  );
};

export default function CurrencySettings() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"rates" | "history">("rates");

  // حالة أسعار الصرف
  const [sarRate, setSarRate] = useState("530");
  const [usdRate, setUsdRate] = useState("2000");

  // سجل التحديثات
  const [historyLogs, setHistoryLogs] = useState([
    {
      id: 1,
      code: "SAR",
      action: "تحديث سعر الصرف",
      user: "الأدمن الرئيسي",
      value: "1 SAR = 535 YER",
      time: "10:30 ص",
      date: "2026-04-10",
    },
    {
      id: 2,
      code: "USD",
      action: "تحديث سعر الصرف",
      user: "الأدمن الرئيسي",
      value: "1 USD = 2050 YER",
      time: "09:15 ص",
      date: "2026-04-09",
    },
    {
      id: 3,
      code: "SAR",
      action: "تحديث سعر الصرف",
      user: "محاسب أول",
      value: "1 SAR = 530 YER",
      time: "02:45 م",
      date: "2026-04-08",
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // جلب أسعار الصرف من قاعدة البيانات
  const fetchRates = async () => {
    try {
      const res = await fetch("/api/settings/currency");
      const data = await res.json();
      if (!data.error) {
        setRates(data);
        // تحديث القيم من قاعدة البيانات
        const sar = data.find((r: any) => r.fromCurrency === "SAR");
        const usd = data.find((r: any) => r.fromCurrency === "USD");
        if (sar) setSarRate(sar.rate.toString());
        if (usd) setUsdRate(usd.rate.toString());
      }
    } catch (err) {
      console.error("Error fetching rates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchRates();
    }
  }, [mounted]);

  // حفظ التحديثات
  const handleSaveRates = async () => {
    setIsSaving(true);
    try {
      // حفظ في قاعدة البيانات
      await fetch("/api/settings/currency", {
        method: "POST",
        body: JSON.stringify([
          { fromCurrency: "SAR", toCurrency: "YER", rate: parseFloat(sarRate) },
          { fromCurrency: "USD", toCurrency: "YER", rate: parseFloat(usdRate) },
        ]),
      });

      // إضافة إلى السجل
      const newLog = {
        id: Date.now(),
        code: "SAR/USD",
        action: "تحديث أسعار الصرف",
        user: "الأدمن الرئيسي",
        value: `SAR: ${sarRate}, USD: ${usdRate}`,
        time: new Date().toLocaleTimeString("ar-YE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toLocaleDateString("ar-YE"),
      };
      setHistoryLogs([newLog, ...historyLogs]);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving rates:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // تحديث عملة مفردة
  const handleUpdateSingle = (code: string, newRate: string) => {
    if (code === "SAR") {
      setSarRate(newRate);
    } else if (code === "USD") {
      setUsdRate(newRate);
    }

    // إضافة إلى السجل
    const newLog = {
      id: Date.now(),
      code: code,
      action: "تحديث سعر الصرف",
      user: "الأدمن الرئيسي",
      value: `1 ${code} = ${newRate} YER`,
      time: new Date().toLocaleTimeString("ar-YE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString("ar-YE"),
    };
    setHistoryLogs([newLog, ...historyLogs]);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8]">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* الترويسة - متجاوبة */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/settings">
              <button className="p-2 sm:p-2.5 bg-white hover:bg-gray-100 rounded-xl sm:rounded-2xl shadow-sm transition-all border border-[#E8D5A3]/30">
                <ArrowRight className="text-[#1A1612] w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>
            <div className="p-2 sm:p-3 bg-gradient-to-br from-[#C9A962] to-[#E8D5A3] rounded-xl sm:rounded-2xl shadow-lg">
              <Coins className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1A1612] italic tracking-tight">
                إدارة أسعار الصرف
              </h1>
              <p className="text-[#9A7B3C]/70 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5">
                نظام إدارة العملات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-[#E8D5A3]/30">
              <ShieldCheck size={14} className="sm:w-4 sm:h-4 text-[#C9A962]" />
              <span className="text-[9px] sm:text-[10px] font-bold text-[#1A1612]">
                تشفير كامل
              </span>
            </div>
          </div>
        </div>

        {/* رسالة نجاح */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700"
            >
              <CheckCircle size={16} />
              <span className="text-xs font-bold">
                تم حفظ أسعار الصرف بنجاح
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* تبويبات للجوال */}
        <div className="sm:hidden flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("rates")}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === "rates"
                ? "bg-[#C9A962] text-white"
                : "bg-white text-gray-600 border border-[#E8D5A3]/30"
            }`}
          >
            أسعار الصرف
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === "history"
                ? "bg-[#C9A962] text-white"
                : "bg-white text-gray-600 border border-[#E8D5A3]/30"
            }`}
          >
            سجل التحديثات
          </button>
        </div>

        {/* عرض الجوال - بطاقات العملات */}
        <div
          className={`${activeTab === "rates" ? "block" : "hidden"} sm:hidden space-y-3 mb-6`}
        >
          <MobileCurrencyCard
            currency="ريال سعودي"
            code="SAR"
            flag="🇸🇦"
            rate={sarRate}
            onUpdate={handleUpdateSingle}
          />
          <MobileCurrencyCard
            currency="دولار أمريكي"
            code="USD"
            flag="🇺🇸"
            rate={usdRate}
            onUpdate={handleUpdateSingle}
          />

          {/* زر الحفظ للجوال */}
          <button
            onClick={handleSaveRates}
            disabled={isSaving}
            className="w-full py-3 bg-gradient-to-r from-[#C9A962] to-[#D4B36A] text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={16} /> جاري الحفظ...
              </>
            ) : (
              <>
                <Save size={16} /> اعتماد جميع الأسعار
              </>
            )}
          </button>
        </div>

        {/* شبكة أسعار الصرف - للكمبيوتر */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* كرت الريال السعودي */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border-b-4 border-[#C9A962] p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-xl relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 opacity-5 text-[#C9A962]">
              <Coins size={120} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[#FAF3E8] to-[#F5EBE0] rounded-xl sm:rounded-2xl text-[#9A7B3C]">
                <TrendingUp size={20} className="sm:w-6 sm:h-6" />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black bg-[#C9A962] text-white px-2 sm:px-3 py-1 rounded-full">
                SAR → YER
              </span>
            </div>
            <p className="text-gray-400 text-[9px] sm:text-[10px] font-bold uppercase mb-1">
              سعر صرف الريال السعودي
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#9A7B3C]">
                🇸🇦
              </span>
              <input
                type="number"
                step="0.01"
                value={sarRate}
                onChange={(e) => setSarRate(e.target.value)}
                className="text-3xl sm:text-4xl font-black text-[#1A1612] w-full bg-transparent border-none outline-none focus:ring-0"
              />
              <span className="text-xs sm:text-sm font-bold text-gray-400">
                YER
              </span>
            </div>
            <p className="text-[9px] text-gray-400 mt-2">
              1 ريال سعودي = {sarRate} ريال يمني
            </p>
          </motion.div>

          {/* كرت الدولار الأمريكي */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-[#2A241E] to-[#1A1612] p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-2xl relative overflow-hidden text-white"
          >
            <div className="absolute -right-4 -top-4 opacity-10 text-white">
              <DollarSign size={120} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 sm:p-3 bg-white/10 rounded-xl sm:rounded-2xl text-[#C9A962]">
                <TrendingUp size={20} className="sm:w-6 sm:h-6" />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black bg-[#C9A962] text-[#1A1612] px-2 sm:px-3 py-1 rounded-full">
                USD → YER
              </span>
            </div>
            <p className="text-gray-400 text-[9px] sm:text-[10px] font-bold uppercase mb-1">
              سعر صرف الدولار الأمريكي
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black">🇺🇸</span>
              <input
                type="number"
                step="0.01"
                value={usdRate}
                onChange={(e) => setUsdRate(e.target.value)}
                className="text-3xl sm:text-4xl font-black text-white w-full bg-transparent border-none outline-none focus:ring-0"
              />
              <span className="text-xs sm:text-sm font-bold text-gray-400">
                YER
              </span>
            </div>
            <p className="text-[9px] text-gray-400 mt-2">
              1 دولار أمريكي = {usdRate} ريال يمني
            </p>
          </motion.div>
        </div>

        {/* زر الحفظ للكمبيوتر */}
        <div className="hidden sm:block mb-8">
          <button
            onClick={handleSaveRates}
            disabled={isSaving}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#C9A962] to-[#D4B36A] text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={16} /> جاري اعتماد
                الأسعار...
              </>
            ) : (
              <>
                <Save size={16} /> اعتماد أسعار الصرف الجديدة
              </>
            )}
          </button>
        </div>

        {/* سجل التحديثات - للكمبيوتر */}
        <div
          className={`${activeTab === "history" ? "block" : "hidden"} sm:block`}
        >
          <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-sm border border-[#E8D5A3]/30">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 bg-[#C9A962]/10 rounded-xl">
                <History className="text-[#C9A962] w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1A1612]">
                سجل التحديثات
              </h2>
            </div>

            {/* عرض الجوال للسجل */}
            <div className="sm:hidden space-y-3">
              {historyLogs.map((log) => (
                <MobileHistoryItem key={log.id} item={log} />
              ))}
            </div>

            {/* عرض الكمبيوتر للسجل */}
            <div className="hidden sm:block space-y-3">
              {historyLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-[#FDF8F2] rounded-xl sm:rounded-2xl border border-transparent hover:border-[#C9A962]/30 transition-all"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center text-[#C9A962] font-black text-xs">
                      {log.code}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-black text-[#1A1612]">
                        {log.action}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold">
                        {log.user} • {log.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm sm:text-base font-black text-[#C9A962]">
                      {log.value}
                    </p>
                    <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase">
                      {log.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {historyLogs.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <History size={40} className="mx-auto mb-3" />
                <p className="text-xs font-bold uppercase">
                  لا توجد تحديثات سابقة
                </p>
              </div>
            )}
          </div>
        </div>

        {/* معلومات العملة الأساسية */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[#C9A962]/10 to-[#E8D5A3]/10 rounded-2xl border border-[#C9A962]/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl">
              <CircleDollarSign size={20} className="text-[#C9A962]" />
            </div>
            <div>
              <p className="text-xs font-black text-[#1A1612]">
                العملة الأساسية للنظام
              </p>
              <p className="text-lg font-black text-[#C9A962]">
                الريال اليمني (YER) 🇾🇪
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
