"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  ArrowRight,
  Save,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
  Percent,
  FileText,
  CheckCircle2,
  Building2,
  Home,
  Upload,
  Globe,
  Smartphone,
  AlertCircle,
  RefreshCw,
  X,
  Camera,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function StoreSettings() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // ✅ حالة نموذج الإعدادات - بدون بيانات وهمية (فارغة تماماً)
  const [formData, setFormData] = useState({
    storeNameAr: "",
    storeNameEn: "",
    commercialRegister: "",
    phone: "",
    phone2: "",
    email: "",
    address: "",
    website: "",
    currency: "YER",
  });

  // ✅ جلب البيانات الحقيقية من قاعدة البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings/store");
        const data = await response.json();

        if (!data.error && data.storeNameAr) {
          // إذا وجدت بيانات، املأ النموذج بها
          setFormData({
            storeNameAr: data.storeNameAr || "",
            storeNameEn: data.storeNameEn || "",
            commercialRegister: data.commercialRegister || "",
            phone: data.phone || "",
            phone2: data.phone2 || "",
            email: data.email || "",
            address: data.address || "",
            website: data.website || "",
            currency: data.currency || "YER",
          });
        }
        // إذا لم توجد بيانات (أول مرة)، يبقى النموذج فارغاً
      } catch (error) {
        console.error("خطأ في جلب الإعدادات:", error);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/settings/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (error) {
      console.error("خطأ في الحفظ:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ عرض شاشة تحميل أثناء جلب البيانات
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 w-10 h-10 text-[#C9A962]" />
          <p className="text-sm font-black text-[#1A1612]/50 uppercase tracking-widest">
            جاري تحميل الإعدادات...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] text-[#1A1612] selection:bg-[#C9A962]/20 selection:text-[#9A7B3C] pb-20 sm:pb-24">
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
            هوية المتجر
          </h1>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 bg-[#C9A962] rounded-xl text-white"
          >
            {isSaving ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
        {/* الترويسة الرئيسية */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          >
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/settings">
                <button className="p-2 sm:p-2.5 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-[#E8D5A3]/50 shadow-sm">
                  <ArrowRight className="text-[#1A1612] w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
            </div>
            <div className="p-2.5 sm:p-3 md:p-4 bg-gradient-to-br from-[#F5EBE0] to-[#E8D5A3] rounded-xl sm:rounded-2xl shadow-sm border border-[#C9A962]/20">
              <Store
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#9A7B3C]"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#1A1612]">
                إعدادات المتجر{" "}
                <span className="text-[#C9A962] font-light text-lg sm:text-xl md:text-2xl">
                  | الهوية العامة
                </span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#1A1612]/50 mt-1 sm:mt-2 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]" />
                <span className="hidden sm:inline">
                  إدارة اسم المتجر، الشعار، ومعلومات التواصل للفواتير والتقارير.
                </span>
                <span className="sm:hidden">اسم المتجر، الشعار، والتواصل</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* رسالة نجاح */}
        <AnimatePresence>
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700"
            >
              <CheckCircle2 size={16} />
              <span className="text-xs sm:text-sm font-bold">
                تم حفظ الإعدادات بنجاح
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* تنبيه العملة للجوال */}
        <div className="sm:hidden mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-amber-800">
              النظام بدون ضريبة
            </p>
            <p className="text-[10px] text-amber-600">
              النظام معد للعمل في اليمن - العملة الأساسية: ريال يمني (YER)
            </p>
          </div>
        </div>

        {/* نموذج الإعدادات */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* البطاقة 1: المعلومات الأساسية والشعار */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl border border-[#E8D5A3]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_15px_40px_rgba(201,169,98,0.05)]"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 border-b border-[#E8D5A3]/30 pb-3 sm:pb-4">
              <div className="p-1.5 sm:p-2 bg-[#C9A962]/10 rounded-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#9A7B3C]" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1A1612]">
                المعلومات الأساسية
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* رفع الشعار */}
              <div className="col-span-1">
                <label className="block text-[10px] sm:text-xs font-black text-gray-600 mb-2">
                  شعار المتجر
                </label>
                <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-[#E8D5A3] bg-[#FDF8F2] rounded-xl sm:rounded-2xl hover:bg-[#F5EBE0] transition-colors cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl"
                    />
                  ) : (
                    <>
                      <div className="p-3 sm:p-4 bg-white rounded-full shadow-sm mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                        <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-[#C9A962]" />
                      </div>
                      <p className="text-xs sm:text-sm font-black text-[#1A1612] text-center">
                        اضغط لرفع الشعار
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1 font-bold">
                        PNG, JPG (Max 2MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* أسماء المتجر */}
              <div className="col-span-1 md:col-span-2 space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  <label className="block text-[10px] sm:text-xs font-black text-gray-600 mb-1.5 sm:mb-2">
                    اسم المتجر (بالعربية)
                  </label>
                  <input
                    type="text"
                    name="storeNameAr"
                    value={formData.storeNameAr}
                    onChange={handleInputChange}
                    className="w-full bg-[#FDF8F2] border border-[#E8D5A3] text-[#1A1612] text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] block p-2.5 sm:p-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-black text-gray-600 mb-1.5 sm:mb-2">
                    اسم المتجر (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    name="storeNameEn"
                    value={formData.storeNameEn}
                    onChange={handleInputChange}
                    dir="ltr"
                    className="w-full bg-[#FDF8F2] border border-[#E8D5A3] text-[#1A1612] text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] block p-2.5 sm:p-3 outline-none transition-all text-left"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-black text-gray-600 mb-1.5 sm:mb-2">
                    العملة الأساسية
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full bg-[#FDF8F2] border border-[#E8D5A3] text-[#1A1612] text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] block p-2.5 sm:p-3 outline-none transition-all"
                  >
                    <option value="YER">🇾🇪 ريال يمني (YER)</option>
                    <option value="SAR">🇸🇦 ريال سعودي (SAR)</option>
                    <option value="USD">🇺🇸 دولار أمريكي (USD)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* البطاقة 2: البيانات التجارية */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl border border-[#E8D5A3]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_15px_40px_rgba(201,169,98,0.05)]"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 border-b border-[#E8D5A3]/30 pb-3 sm:pb-4">
                <div className="p-1.5 sm:p-2 bg-[#C9A962]/10 rounded-lg">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#9A7B3C]" />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1A1612]">
                  البيانات التجارية
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  <label className="block text-[10px] sm:text-xs font-black text-gray-600 mb-1.5 sm:mb-2">
                    السجل التجاري
                  </label>
                  <input
                    type="text"
                    name="commercialRegister"
                    value={formData.commercialRegister}
                    onChange={handleInputChange}
                    className="w-full bg-[#FDF8F2] border border-[#E8D5A3] text-[#1A1612] text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] block p-2.5 sm:p-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-black text-gray-600 mb-1.5 sm:mb-2">
                    الموقع الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]/60" />
                    </div>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      dir="ltr"
                      className="w-full bg-[#FDF8F2] border border-[#E8D5A3] text-[#1A1612] text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] block pr-9 sm:pr-10 p-2.5 sm:p-3 outline-none transition-all text-left"
                    />
                  </div>
                </div>

                {/* تنبيه عدم وجود ضريبة للكمبيوتر */}
                <div className="hidden sm:block mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      size={14}
                      className="text-amber-600 shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-black text-amber-800">
                        النظام معفي من الضريبة
                      </p>
                      <p className="text-[10px] text-amber-600">
                        النظام معد للعمل في اليمن - لا توجد ضريبة قيمة مضافة
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* البطاقة 3: معلومات التواصل */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-xl border border-[#E8D5A3]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_15px_40px_rgba(201,169,98,0.05)]"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 border-b border-[#E8D5A3]/30 pb-3 sm:pb-4">
                <div className="p-1.5 sm:p-2 bg-[#C9A962]/10 rounded-lg">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#9A7B3C]" />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-black text-[#1A1612]">
                  معلومات التواصل
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black text-gray-600 mb-1.5 sm:mb-2">
                      رقم الهاتف الرئيسي
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]/60" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        dir="ltr"
                        className="w-full bg-[#FDF8F2] border border-[#E8D5A3] text-[#1A1612] text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] block pr-9 sm:pr-10 p-2.5 sm:p-3 outline-none transition-all text-left"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black text-gray-600 mb-1.5 sm:mb-2">
                      رقم هاتف إضافي
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]/60" />
                      </div>
                      <input
                        type="text"
                        name="phone2"
                        value={formData.phone2}
                        onChange={handleInputChange}
                        dir="ltr"
                        className="w-full bg-[#FDF8F2] border border-[#E8D5A3] text-[#1A1612] text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] block pr-9 sm:pr-10 p-2.5 sm:p-3 outline-none transition-all text-left"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-black text-gray-600 mb-1.5 sm:mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]/60" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      dir="ltr"
                      className="w-full bg-[#FDF8F2] border border-[#E8D5A3] text-[#1A1612] text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] block pr-9 sm:pr-10 p-2.5 sm:p-3 outline-none transition-all text-left"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-black text-gray-600 mb-1.5 sm:mb-2">
                    العنوان الفعلي (للفواتير)
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 pointer-events-none">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]/60" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full bg-[#FDF8F2] border border-[#E8D5A3] text-[#1A1612] text-xs sm:text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] block pr-9 sm:pr-10 p-2.5 sm:p-3 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* شريط الإجراءات السفلي - مخفي في الجوال (يوجد زر في الأعلى) */}
      <div className="hidden sm:block fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-[#E8D5A3]/50 p-4 shadow-[0_-10px_30px_rgba(201,169,98,0.05)] lg:pl-72">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-bold text-gray-500">
            سيتم تطبيق هذه البيانات على جميع الفواتير والتقارير المصدرة من
            النظام.
          </p>
          <div className="flex gap-3">
            <Link href="/settings">
              <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-black text-sm transition-colors border border-gray-200">
                إلغاء
              </button>
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all duration-300 shadow-lg ${
                isSaved
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                  : "bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#9A7B3C] hover:from-[#1A1612] hover:to-[#2A241E] text-white shadow-[#C9A962]/20"
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  تم الحفظ بنجاح
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ التعديلات
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
