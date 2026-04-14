"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
  Menu,
  Diamond,
  LogOut,
  // WalletCards,
  Calculator,
  X,
  Coins,
  Database,
} from "lucide-react";
import Link from "next/link";
import "./globals.css";

// --- روابط النظام المحاسبي ---
const SIDEBAR_LINKS = [
  { name: "لوحة القيادة", icon: LayoutDashboard, path: "/" },
  { name: "القيود اليومية", icon: Calculator, path: "/journal" },
  { name: "نقطة البيع", icon: ShoppingCart, path: "/pos" },
  { name: "التجار والعملاء", icon: Users, path: "/merchants" },
  { name: "المخزون والجرد", icon: Package, path: "/inventory" },
  { name: "سجل المبيعات", icon: FileText, path: "/sales" },
  //{ name: "المحفظة والعملات", icon: WalletCards, path: "/wallet" },
  { name: "إدارة الصرف", icon: Coins, path: "/settings/currency" },
  { name: "قاعدة البيانات", icon: Database, path: "/settings/database" },
  { name: "إعدادات النظام", icon: Settings, path: "/settings" },
];

// --- مكون القائمة الجانبية الملكية ---
function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
}: {
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="h-full w-72 bg-gradient-to-b from-[#1A1612] to-[#0D0B09] border-l border-[#C9A962]/20 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] relative">
      {/* زر إغلاق للموبايل */}
      <button
        onClick={() => setIsMobileOpen(false)}
        className="absolute top-6 left-6 text-gray-500 hover:text-white lg:hidden"
      >
        <X size={24} />
      </button>

      {/* الشعار */}
      <div className="p-8 border-b border-[#C9A962]/10 flex items-center gap-4">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="p-2.5 bg-gradient-to-br from-[#C9A962] to-[#9A7B3C] rounded-xl shadow-lg shadow-[#C9A962]/20"
        >
          <Diamond size={24} className="text-white" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-black text-[#C9A962] italic tracking-tight">
            ترفة
          </h1>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">
            النظام المحاسبي
          </p>
        </div>
      </div>

      {/* الروابط */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
        {SIDEBAR_LINKS.map((link, idx) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={idx}
              href={link.path}
              onClick={() => setIsMobileOpen(false)}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive ? "bg-gradient-to-r from-[#C9A962]/20 to-transparent border-r-2 border-[#C9A962]" : "hover:bg-white/5"}`}
              >
                <link.icon
                  size={20}
                  className={
                    isActive
                      ? "text-[#C9A962]"
                      : "text-gray-500 group-hover:text-[#E8D5A3]"
                  }
                />
                <span
                  className={`font-bold text-sm transition-colors ${isActive ? "text-[#C9A962]" : "text-gray-400 group-hover:text-gray-200"}`}
                >
                  {link.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* تذييل القائمة (تسجيل الخروج) */}
      <div className="p-6 border-t border-[#C9A962]/10">
        <button
          onClick={async () => {
            // 1. تسجيل الخروج ومسح الجلسة بدون إعادة توجيه تلقائية
            await signOut({ redirect: false });
            // 2. فرض الانتقال القسري إلى بورت المتجر
            window.location.assign("http://localhost:3000");
          }}
          className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all group"
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-bold text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (ثابت في الكمبيوتر) */}
      <div className="hidden lg:block h-screen sticky top-0 right-0 z-40">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar (متحرك في الجوال) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// --- المكون الرئيسي والجذر ---
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#FFFBF7] text-[#1A1A1A] antialiased">
        <SessionProvider>
          {isLoginPage ? (
            // إذا كانت صفحة الدخول، اعرضها بدون القائمة الجانبية
            children
          ) : (
            // هيكل الداشبورد لبقية الصفحات
            <div className="flex min-h-screen">
              <Sidebar
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
              />

              <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* شريط الموبايل العلوي (يظهر فقط في الشاشات الصغيرة لفتح القائمة) */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-[#1A1612] border-b border-[#C9A962]/20 sticky top-0 z-30">
                  <div className="flex items-center gap-3">
                    <Diamond size={20} className="text-[#C9A962]" />
                    <h1 className="text-lg font-black text-[#C9A962] italic">
                      ترفة
                    </h1>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 bg-white/5 rounded-lg text-[#C9A962]"
                  >
                    <Menu size={24} />
                  </button>
                </div>

                {/* المحتوى الرئيسي للداشبورد (page.tsx وغيرها) */}
                <div className="flex-1 overflow-y-auto">{children}</div>
              </main>
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
