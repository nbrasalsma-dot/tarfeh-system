"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Lock,
  Mail,
  Crown,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calculator,
  FileText,
  Target,
  ShieldCheck,
  TrendingUp,
  Gem,
  Star,
  Diamond,
  Fingerprint,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { signIn } from "next-auth/react";

// --- بيانات سلايدر المحاسبة الفاخر (مع أيقونات متعددة وألوان متدرجة) ---
const accountingSlides = [
  {
    mainIcon: (
      <Calculator size={42} className="text-[#C9A962]" strokeWidth={1.5} />
    ),
    secondaryIcon: <TrendingUp size={20} className="text-[#C9A962]/60" />,
    title: "إدارة القيود",
    subtitle: "بدقة متناهية",
    description:
      "راقب حركة أموالك وصافي الربح في كل لحظة مع نظام القيد المزدوج المتطور.",
    gradient: "from-[#1A1612] via-[#2A241E] to-[#1A1612]",
    accentColor: "#C9A962",
    stats: [
      { label: "دقة المعالجة", value: "99.9%" },
      { label: "سرعة التنفيذ", value: "0.3s" },
    ],
  },
  {
    mainIcon: <Target size={42} className="text-[#D4B36A]" strokeWidth={1.5} />,
    secondaryIcon: <Gem size={20} className="text-[#D4B36A]/60" />,
    title: "فرز التجار",
    subtitle: "والعمولات تلقائياً",
    description:
      "النظام يعرف كل شاردة وواردة في متجرك ويحسب العمولات والخصومات بدقة.",
    gradient: "from-[#1A1612] via-[#2A241E] to-[#1A1612]",
    accentColor: "#D4B36A",
    stats: [
      { label: "توفير الوقت", value: "85%" },
      { label: "دقة الحسابات", value: "100%" },
    ],
  },
  {
    mainIcon: (
      <FileText size={42} className="text-[#E8D5A3]" strokeWidth={1.5} />
    ),
    secondaryIcon: <Star size={20} className="text-[#E8D5A3]/60" />,
    title: "كشوفات الحساب",
    subtitle: "الفخمة",
    description:
      "استخرج تقارير Excel و PDF بتصميم راقٍ يناسب هوية ترفة الفاخرة.",
    gradient: "from-[#1A1612] via-[#2A241E] to-[#1A1612]",
    accentColor: "#E8D5A3",
    stats: [
      { label: "قوالب جاهزة", value: "24+" },
      { label: "صيغ متعددة", value: "5+" },
    ],
  },
];

// --- قيم ثابتة للجسيمات لتجنب Hydration Mismatch ---
const PARTICLE_COUNT = 20;
const FIXED_PARTICLE_VALUES = [
  {
    x: 92.69,
    y: 32.39,
    opacity: 0.24,
    scale: 0.54,
    duration: 18,
    yMove: -15,
    xMove: 3,
  },
  {
    x: 12.39,
    y: 22.24,
    opacity: 0.25,
    scale: 0.83,
    duration: 22,
    yMove: -20,
    xMove: -5,
  },
  {
    x: 41.02,
    y: 50.43,
    opacity: 0.28,
    scale: 0.79,
    duration: 16,
    yMove: -12,
    xMove: 8,
  },
  {
    x: 12.26,
    y: 12.95,
    opacity: 0.18,
    scale: 0.77,
    duration: 25,
    yMove: -18,
    xMove: -3,
  },
  {
    x: 36.34,
    y: 79.46,
    opacity: 0.38,
    scale: 0.92,
    duration: 20,
    yMove: -10,
    xMove: 6,
  },
  {
    x: 23.66,
    y: 87.66,
    opacity: 0.37,
    scale: 0.61,
    duration: 19,
    yMove: -22,
    xMove: -7,
  },
  {
    x: 63.48,
    y: 82.99,
    opacity: 0.1,
    scale: 0.68,
    duration: 24,
    yMove: -14,
    xMove: 4,
  },
  {
    x: 86.39,
    y: 1.67,
    opacity: 0.17,
    scale: 0.74,
    duration: 17,
    yMove: -25,
    xMove: -6,
  },
  {
    x: 58.1,
    y: 25.29,
    opacity: 0.32,
    scale: 0.84,
    duration: 21,
    yMove: -16,
    xMove: 5,
  },
  {
    x: 20.32,
    y: 84.45,
    opacity: 0.39,
    scale: 0.69,
    duration: 23,
    yMove: -19,
    xMove: -4,
  },
  {
    x: 29.87,
    y: 38.1,
    opacity: 0.14,
    scale: 0.67,
    duration: 15,
    yMove: -13,
    xMove: 7,
  },
  {
    x: 61.64,
    y: 16.06,
    opacity: 0.22,
    scale: 0.61,
    duration: 26,
    yMove: -21,
    xMove: -8,
  },
  {
    x: 80.18,
    y: 91.01,
    opacity: 0.36,
    scale: 0.72,
    duration: 18,
    yMove: -11,
    xMove: 3,
  },
  {
    x: 41.99,
    y: 39.84,
    opacity: 0.35,
    scale: 0.69,
    duration: 20,
    yMove: -17,
    xMove: -5,
  },
  {
    x: 54.23,
    y: 93.02,
    opacity: 0.27,
    scale: 0.99,
    duration: 22,
    yMove: -23,
    xMove: 6,
  },
  {
    x: 37.82,
    y: 38.1,
    opacity: 0.22,
    scale: 0.59,
    duration: 16,
    yMove: -15,
    xMove: -2,
  },
  {
    x: 79.04,
    y: 88.53,
    opacity: 0.18,
    scale: 0.58,
    duration: 24,
    yMove: -20,
    xMove: 4,
  },
  {
    x: 6.9,
    y: 34.4,
    opacity: 0.26,
    scale: 0.72,
    duration: 19,
    yMove: -14,
    xMove: -6,
  },
  {
    x: 75.03,
    y: 14.9,
    opacity: 0.38,
    scale: 0.59,
    duration: 21,
    yMove: -18,
    xMove: 7,
  },
  {
    x: 50.83,
    y: 89.12,
    opacity: 0.13,
    scale: 0.5,
    duration: 17,
    yMove: -16,
    xMove: -3,
  },
];

// --- مكون الجسيمات العائمة للخلفية (بدون Hydration Mismatch) ---
const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // لا تقم بعرض أي شيء حتى يتم التحميل على العميل
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {FIXED_PARTICLE_VALUES.map((particle, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: particle.opacity,
            scale: particle.scale,
          }}
          animate={{
            y: [
              `${particle.y}%`,
              `${particle.y + particle.yMove}%`,
              `${particle.y}%`,
            ],
            x: [
              `${particle.x}%`,
              `${particle.x + particle.xMove}%`,
              `${particle.x}%`,
            ],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 bg-[#C9A962]/30 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

// --- مكون عرض كلمة المرور ---
const PasswordInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative">
        <input
          type="password"
          value={value}
          onChange={onChange}
          className="w-full px-5 py-4 bg-gradient-to-r from-[#1A1612]/80 to-[#0D0B09]/80 backdrop-blur-sm border border-[#C9A962]/20 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C9A962] focus:ring-4 focus:ring-[#C9A962]/10 transition-all duration-500 text-right pr-12"
          placeholder="••••••••"
          required
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A962]/50">
          <EyeOff size={18} />
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full px-5 py-4 bg-gradient-to-r from-[#1A1612]/80 to-[#0D0B09]/80 backdrop-blur-sm border border-[#C9A962]/20 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#C9A962] focus:ring-4 focus:ring-[#C9A962]/10 transition-all duration-500 text-right pr-12"
        placeholder="••••••••"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A962]/50 hover:text-[#C9A962] transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  // --- حل مشكلة Hydration Mismatch ---
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- إعدادات السلايدر المحاسبي ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setSlideDirection(1);
      setCurrentSlide((prev) => (prev + 1) % accountingSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [mounted]);

  // --- تأثير الميلان الثلاثي الأبعاد (3D Tilt Effect) ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("بيانات الدخول غير صحيحة، تأكد من الإيميل والباسورد");
      }

      console.log("✅ تم إثبات الهوية بنجاح!");
      window.location.replace("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setSlideDirection(1);
    setCurrentSlide((prev) => (prev + 1) % accountingSlides.length);
  };

  const prevSlide = () => {
    setSlideDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + accountingSlides.length) % accountingSlides.length,
    );
  };

  // --- متغيرات الحركة للسلايدر ---
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  // --- عرض بسيط أثناء التحميل الأولي لمنع Hydration Mismatch ---
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FAF3E8] to-[#F5EDE3] flex items-center justify-center">
        <div className="text-[#C9A962] text-xl font-black">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FAF3E8] to-[#F5EDE3] flex items-center justify-center p-4 md:p-6 overflow-hidden relative">
      {/* --- الخلفية السائلة المتحركة (The Liquid Nebula) --- */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 45, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[15%] -left-[10%] w-[50%] h-[50%] bg-[#C9A962]/15 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            rotate: [0, -60, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[15%] -right-[10%] w-[50%] h-[50%] bg-[#9A7B3C]/12 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-[#E8D5A3]/10 rounded-full blur-[100px]"
        />
      </div>

      <FloatingParticles />

      {/* --- الـ Layout الرئيسي (تصميم متجاوب فاخر) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full relative z-10">
        {/* --- القسم الأيمن: سلايدر المحاسبة الفاخر --- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="hidden lg:flex flex-col"
        >
          <div className="bg-gradient-to-br from-[#1A1612]/95 via-[#2A241E]/95 to-[#1A1612]/95 backdrop-blur-2xl rounded-[3rem] p-8 shadow-2xl border border-[#C9A962]/20 h-full flex flex-col">
            {/* شعار ترفة في السلايدر */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#C9A962]/15">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-2.5 bg-gradient-to-br from-[#C9A962] to-[#9A7B3C] rounded-xl"
              >
                <Diamond size={24} className="text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-black text-[#C9A962] italic tracking-tight">
                  ترفة
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
                  المحاسبة الذكية
                </p>
              </div>
            </div>

            {/* السلايدر الرئيسي */}
            <div className="flex-1 relative overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  key={currentSlide}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className={`absolute inset-0 flex flex-col justify-center p-8 rounded-2xl bg-gradient-to-br ${accountingSlides[currentSlide].gradient} border border-[#C9A962]/10`}
                >
                  {/* أيقونة رئيسية مع تأثير نبض */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mb-8"
                  >
                    <div className="inline-flex p-5 bg-gradient-to-br from-[#C9A962]/15 to-transparent rounded-2xl border border-[#C9A962]/20">
                      {accountingSlides[currentSlide].mainIcon}
                    </div>
                  </motion.div>

                  {/* العنوان والوصف */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2">
                      {accountingSlides[currentSlide].secondaryIcon}
                      <span className="text-[#C9A962] text-xs font-bold uppercase tracking-widest">
                        ميزة حصرية
                      </span>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight">
                      {accountingSlides[currentSlide].title}
                      <br />
                      <span className="text-[#C9A962]">
                        {accountingSlides[currentSlide].subtitle}
                      </span>
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {accountingSlides[currentSlide].description}
                    </p>
                  </div>

                  {/* إحصائيات */}
                  <div className="grid grid-cols-2 gap-4">
                    {accountingSlides[currentSlide].stats.map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="bg-white/5 rounded-xl p-4 border border-[#C9A962]/10"
                      >
                        <p className="text-2xl font-black text-[#C9A962]">
                          {stat.value}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* عناصر التحكم بالسلايدر */}
            <div className="mt-8 flex justify-between items-center">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevSlide}
                  className="p-3 bg-white/5 rounded-xl text-[#C9A962] hover:bg-[#C9A962] hover:text-white transition-all duration-300 border border-[#C9A962]/20"
                >
                  <ChevronRight size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, x: 3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextSlide}
                  className="p-3 bg-white/5 rounded-xl text-[#C9A962] hover:bg-[#C9A962] hover:text-white transition-all duration-300 border border-[#C9A962]/20"
                >
                  <ChevronLeft size={18} />
                </motion.button>
              </div>

              {/* نقاط المؤشر */}
              <div className="flex gap-2">
                {accountingSlides.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      setSlideDirection(idx > currentSlide ? 1 : -1);
                      setCurrentSlide(idx);
                    }}
                    whileHover={{ scale: 1.2 }}
                    className={`transition-all duration-300 ${
                      idx === currentSlide
                        ? "w-8 h-2 bg-[#C9A962] rounded-full"
                        : "w-2 h-2 bg-[#C9A962]/30 rounded-full hover:bg-[#C9A962]/50"
                    }`}
                  />
                ))}
              </div>

              <p className="text-[10px] text-[#C9A962]/60 font-bold uppercase tracking-widest">
                {String(currentSlide + 1).padStart(2, "0")} /{" "}
                {String(accountingSlides.length).padStart(2, "0")}
              </p>
            </div>

            {/* مميزات إضافية أسفل السلايدر */}
            <div className="mt-8 pt-6 border-t border-[#C9A962]/15 grid grid-cols-3 gap-3">
              {[
                { icon: <ShieldCheck size={14} />, text: "تشفير كامل" },
                { icon: <TrendingUp size={14} />, text: "تقارير لحظية" },
                { icon: <Fingerprint size={14} />, text: "دخول آمن" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-1.5 text-[#C9A962]/60"
                >
                  {item.icon}
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* --- القسم الأيسر: كرت تسجيل الدخول الفاخر --- */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center justify-center"
        >
          <div className="bg-gradient-to-br from-white/90 via-[#FDF8F2]/95 to-white/90 backdrop-blur-2xl border border-[#C9A962]/30 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(201,169,98,0.25)] p-8 md:p-10 space-y-6 relative overflow-hidden w-full max-w-md mx-auto">
            {/* زخارف ذهبية في الزوايا */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#C9A962]/10 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#C9A962]/10 to-transparent rounded-tl-full" />

            {/* خط ذهبي علوي */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />

            {/* الرأسية مع الشعار */}
            <div
              className="text-center space-y-4"
              style={{ transform: "translateZ(60px)" }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative inline-block"
              >
                {/* هالة متوهجة */}
                <div className="absolute inset-0 bg-[#C9A962]/20 blur-2xl rounded-full" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#C9A962] via-[#D4B36A] to-[#9A7B3C] shadow-2xl">
                  <Crown
                    className="w-10 h-10 text-white drop-shadow-lg"
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>

              <div className="space-y-1 w8">
                <h2 className=" p4 text-2x1/200 md:text 1x4 font-black tracking-tight">
                  <span className="bg-gradient-to-r from-[#9A7B3C]/200 via-[#C9A962] to-[#E8D5A3] bg-clip-text text-transparent italic">
                    . نـــظـــام تـــــرفـــة .
                  </span>
                </h2>
                <p className="text-[#9A7B3C]/200 text-[10px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                  نظام ترفة لإدارة الموارد المحاسبية
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A962]" />
                  <p className="text-[#9A7B3C]/60 text-xs font-bold uppercase tracking-[0.3em]">
                    بوابة الدخول
                  </p>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A962]" />
                </div>
              </div>
            </div>

            {/* نموذج تسجيل الدخول */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              dir="rtl"
              style={{ transform: "translateZ(40px)" }}
            >
              {/* رسالة الخطأ */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm text-center font-bold"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* حقل البريد الإلكتروني */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-[#9A7B3C] uppercase tracking-widest mr-1">
                  <Mail size={14} strokeWidth={1.5} />
                  البريد الرقمي
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C9A962]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative w-full px-5 py-4 bg-white/80 backdrop-blur-sm border border-[#C9A962]/20 rounded-2xl text-[#1A1612] placeholder:text-[#1A1612]/30 focus:outline-none focus:border-[#C9A962] focus:ring-4 focus:ring-[#C9A962]/10 transition-all duration-500 text-right"
                    placeholder="admin@tarfeh.com"
                    required
                  />
                </div>
              </div>

              {/* حقل كلمة المرور */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-[#9A7B3C] uppercase tracking-widest mr-1">
                  <Lock size={14} strokeWidth={1.5} />
                  الشفرة السرية
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C9A962]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* خيار تذكرني */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-[#C9A962]/30 rounded-lg peer-checked:bg-[#C9A962] peer-checked:border-[#C9A962] transition-all duration-300 flex items-center justify-center">
                      <CheckCircle
                        size={12}
                        className="text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-[#1A1612]/50 group-hover:text-[#C9A962] transition-colors">
                    تذكرني
                  </span>
                </label>
                <a
                  href="#"
                  className="text-xs text-[#9A7B3C] hover:text-[#C9A962] transition-colors font-bold"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>

              {/* زر تسجيل الدخول */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px -10px rgba(201,169,98,0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-5 bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#9A7B3C] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-black rounded-2xl transition-all duration-700 flex items-center justify-center gap-3 group/btn overflow-hidden ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {/* تأثير اللمعان */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />

                <span className="relative tracking-widest text-sm">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      جاري التحقق...
                    </span>
                  ) : (
                    "تـفـضـل بـالـدخـول"
                  )}
                </span>
                {!isLoading && (
                  <ArrowRight className="relative w-5 h-5 group-hover/btn:translate-x-[-5px] transition-transform duration-300" />
                )}
              </motion.button>
            </form>

            {/* تذييل الصفحة */}
            <div
              className="text-center pt-6 border-t border-[#C9A962]/15 relative z-10"
              style={{ transform: "translateZ(20px)" }}
            >
              <div className="flex items-center justify-center gap-3">
                <Sparkles size={12} className="text-[#C9A962]/40" />
                <p className="text-[10px] font-bold text-[#1A1612]/40 uppercase tracking-[0.2em]">
                  النظام المحاسبي الأول في اليمن
                </p>
                <Sparkles size={12} className="text-[#C9A962]/40" />
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={8}
                    className="text-[#C9A962]/20 fill-[#C9A962]/20"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* هالة خارجية للكرت */}
          <div className="absolute -inset-6 bg-gradient-to-r from-[#C9A962]/10 via-[#E8D5A3]/5 to-[#9A7B3C]/10 blur-3xl -z-10 rounded-[3.5rem]" />
        </motion.div>
      </div>

      {/* إضافة أنماط CSS مخصصة للخلفية المتحركة */}
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
      `}</style>
    </div>
  );
}
