"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Printer,
  Loader2,
  Package,
  User,
  Receipt,
  Wallet,
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
  ArrowLeft,
  CreditCard,
  Banknote,
  Calculator,
  Tag,
  Barcode,
  DollarSign,
  ArrowRight,
  Home,
  RefreshCw,
  Download,
  Eye,
  Share2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";

// --- مكون نافذة معاينة الفاتورة ---
const InvoicePreviewModal = ({
  isOpen,
  onClose,
  cart,
  total,
  customerName,
  paymentMethod,
  selectedCurrency,
  getCurrencySymbol,
  onSavePDF,
  onPrint,
  calculatePrice,
}: any) => {
  const date = new Date().toLocaleString("ar-YE");
  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#C9A962]/20"
          >
            {/* رأس الفاتورة */}
            <div className="sticky top-0 bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black italic">
                  معاينة الفاتورة
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* محتوى الفاتورة */}
            <div className="p-4 sm:p-6">
              {/* معلومات المتجر */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-[#C9A962] italic">
                  متجر ترفة
                </h3>
                <p className="text-xs text-gray-500">نظام محاسبي متكامل</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  رقم الفاتورة: {invoiceNumber}
                </p>
              </div>

              {/* معلومات العميل */}
              <div className="bg-[#FDF8F2] rounded-2xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">العميل:</span>
                    <p className="font-black">{customerName || "عميل نقدي"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">التاريخ:</span>
                    <p className="font-black">{date}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">طريقة الدفع:</span>
                    <p className="font-black">
                      {paymentMethod === "cash" ? "نقدي" : "آجل"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">العملة:</span>
                    <p className="font-black">
                      {getCurrencySymbol(selectedCurrency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* جدول المنتجات */}
              <div className="mb-4">
                <div className="bg-[#1A1612] text-white rounded-xl p-3 grid grid-cols-12 text-xs font-black uppercase tracking-wider">
                  <div className="col-span-5">المنتج</div>
                  <div className="col-span-2 text-center">الكمية</div>
                  <div className="col-span-2 text-center">السعر</div>
                  <div className="col-span-3 text-left">الإجمالي</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {cart.map((item: any) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 p-3 text-sm"
                    >
                      <div className="col-span-5 font-bold truncate">
                        {item.productName}
                      </div>
                      <div className="col-span-2 text-center">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-center">
                        {calculatePrice(
                          item.sellPrice,
                          item.currency,
                        ).toLocaleString()}
                      </div>
                      <div className="col-span-3 text-left font-black text-[#C9A962]">
                        {(
                          item.quantity *
                          calculatePrice(item.sellPrice, item.currency)
                        ).toLocaleString()}{" "}
                        {selectedCurrency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* الإجمالي */}
              <div className="border-t border-[#E8D5A3] pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black">الإجمالي النهائي</span>
                  <span className="text-2xl font-black text-[#C9A962]">
                    {total.toLocaleString()} {selectedCurrency}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  {new Intl.NumberFormat("ar-YE").format(total)}{" "}
                  {getCurrencySymbol(selectedCurrency)} فقط لا غير
                </p>
              </div>

              {/* شكر */}
              <div className="text-center mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-600">
                  شكراً لتعاملكم مع متجر ترفة
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  نتشرف بخدمتكم دائماً
                </p>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="sticky bottom-0 bg-white border-t border-[#E8D5A3]/30 p-4 sm:p-6 rounded-b-2xl sm:rounded-b-3xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onSavePDF}
                  className="flex-1 bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <Download size={18} />
                  حفظ PDF على الجهاز
                </button>
                <button
                  onClick={onPrint}
                  className="flex-1 bg-gradient-to-r from-[#C9A962] to-[#D4B36A] text-[#1A1612] py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <Printer size={18} />
                  طباعة الفاتورة
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
              >
                إغلاق والعودة للسلة
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit">("cash");
  const [selectedCurrency, setSelectedCurrency] = useState<
    "YER" | "SAR" | "USD"
  >("YER");
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]); // ذاكرة أسعار الصرف
  const [isAutoCalc, setIsAutoCalc] = useState(false); // زر التشغيل والإيقاف (مطفأ افتراضياً)

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      if (!data.error) setProducts(data.filter((p: any) => p.currentStock > 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchRates = async () => {
    try {
      const res = await fetch("/api/settings/currency");
      const data = await res.json();
      if (!data.error) setExchangeRates(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchProducts();
      fetchRates();
    }
  }, [mounted]);

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.quantity < product.currentStock) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        );
      } else {
        alert(`الكمية المتوفرة: ${product.currentStock} فقط`);
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          const product = products.find((p: any) => p.id === id);
          if (newQty > 0 && newQty <= (product?.currentStock || 0)) {
            return { ...item, quantity: newQty };
          } else if (newQty > (product?.currentStock || 0)) {
            alert(`الكمية المتوفرة: ${product?.currentStock} فقط`);
          }
        }
        return item;
      }),
    );
  };

  const removeFromCart = (id: string) =>
    setCart(cart.filter((item) => item.id !== id));

  // 👈 الآلة الحاسبة الذكية
  const calculatePrice = (price: any, baseCurrency: string = "YER") => {
    const numPrice = Number(price);
    // إذا كان الحساب الآلي متوقف، أو العملتان متطابقتان، السعر يبقى ثابت
    if (!isAutoCalc || baseCurrency === selectedCurrency) return numPrice;

    // جلب سعر صرف عملة المنتج الأصلية
    const baseRateObj = exchangeRates.find(
      (r) => r.fromCurrency === baseCurrency,
    );
    const baseRate = baseRateObj ? Number(baseRateObj.rate) : 1;

    // جلب سعر صرف العملة المختارة في الواجهة
    const targetRateObj = exchangeRates.find(
      (r) => r.fromCurrency === selectedCurrency,
    );
    const targetRate = targetRateObj ? Number(targetRateObj.rate) : 1;

    // المعادلة: (السعر × سعر صرفه الأساسي) ÷ سعر صرف العملة المطلوبة
    return (numPrice * baseRate) / targetRate;
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + calculatePrice(item.sellPrice, item.currency) * item.quantity,
    0,
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "YER":
        return "ريال يمني";
      case "SAR":
        return "ريال سعودي";
      case "USD":
        return "دولار";
      default:
        return currency;
    }
  };

  // ✅ جديد: معالجة البيع - تظهر المعاينة أولاً
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setShowInvoicePreview(true); // إظهار نافذة المعاينة أولاً
  };

  // ✅ جديد: حفظ الفاتورة وإتمام البيع
  const handleSaveAndComplete = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pos", {
        method: "POST",
        body: JSON.stringify({
          items: cart,
          totalAmount: total,
          customerName: customerName || "عميل نقدي",
          currency: selectedCurrency,
          paymentMethod,
        }),
      });

      if (res.ok) {
        generatePDF(); // حفظ PDF
        setCart([]);
        setCustomerName("");
        setShowCart(false);
        setShowInvoicePreview(false);
        fetchProducts();
        alert("تمت عملية البيع بنجاح وحفظت الفاتورة!");
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      alert("خطأ في الاتصال");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ جديد: طباعة الفاتورة
  const handlePrintInvoice = () => {
    generatePDF(); // ينشئ PDF
    // يمكن إضافة window.print() إذا أردت طباعة HTML مباشرة
  };

  // ... داخل الكود

  const generatePDF = async () => {
    const date = new Date().toLocaleString("ar-YE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    // إنشاء HTML للفاتورة بتنسيق عربي
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Arial', 'Tahoma', sans-serif;
            margin: 0;
            padding: 30px;
            direction: rtl;
            background: white;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #C9A962;
            padding: 30px;
            border-radius: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .store-name {
            font-size: 32px;
            font-weight: bold;
            color: #C9A962;
            margin-bottom: 5px;
          }
          .invoice-title {
            font-size: 18px;
            color: #666;
          }
          .divider {
            border-top: 2px solid #C9A962;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .info-label {
            color: #666;
            font-weight: bold;
          }
          .info-value {
            color: #1A1612;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background: #C9A962;
            color: #1A1612;
            padding: 12px;
            text-align: right;
            font-weight: bold;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          .total-row {
            font-size: 18px;
            font-weight: bold;
            color: #C9A962;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
          }
          @media print {
            body { padding: 0; }
            .invoice-container { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="store-name">متجر ترفة</div>
            <div class="invoice-title">فاتورة بيع</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="info-row">
            <span class="info-label">رقم الفاتورة:</span>
            <span class="info-value">${invoiceNumber}</span>
          </div>
          <div class="info-row">
            <span class="info-label">العميل:</span>
            <span class="info-value">${customerName || "عميل نقدي"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">التاريخ:</span>
            <span class="info-value">${date}</span>
          </div>
          <div class="info-row">
            <span class="info-label">طريقة الدفع:</span>
            <span class="info-value">${paymentMethod === "cash" ? "نقدي" : "آجل"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">العملة:</span>
            <span class="info-value">${getCurrencySymbol(selectedCurrency)}</span>
          </div>
          
          <div class="divider"></div>
          
          <table>
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${cart
                .map(
                  (item: any) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>${calculatePrice(item.sellPrice, item.currency).toLocaleString()} ${selectedCurrency}</td>
                  <td>${(item.quantity * calculatePrice(item.sellPrice, item.currency)).toLocaleString()} ${selectedCurrency}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="divider"></div>
          
          <div class="info-row total-row">
            <span>الإجمالي النهائي:</span>
            <span>${total.toLocaleString()} ${selectedCurrency}</span>
          </div>
          
          <div class="footer">
            <p>شكراً لتعاملكم مع متجر ترفة</p>
            <p>نتشرف بخدمتكم دائماً</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 1000);
          };
        </script>
      </body>
      </html>
    `);

      printWindow.document.close();
    }
  };

  const filtered = products.filter(
    (p: any) =>
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.externalId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!mounted) return null;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] overflow-hidden text-[#1A1612]">
      {/* نافذة معاينة الفاتورة */}
      <InvoicePreviewModal
        isOpen={showInvoicePreview}
        onClose={() => setShowInvoicePreview(false)}
        cart={cart}
        total={total}
        customerName={customerName}
        paymentMethod={paymentMethod}
        selectedCurrency={selectedCurrency}
        getCurrencySymbol={getCurrencySymbol}
        onSavePDF={handleSaveAndComplete}
        onPrint={handlePrintInvoice}
        calculatePrice={calculatePrice}
      />

      {/* زر التنقل للجوال */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#E8D5A3]/30 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showCart ? (
              <>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 bg-gray-100 rounded-xl text-gray-600 flex items-center gap-1"
                >
                  <ArrowRight size={16} />
                  <span className="text-xs font-bold">المنتجات</span>
                </button>
                <Link href="/">
                  <button className="p-2 bg-gray-100 rounded-xl text-gray-600">
                    <Home size={16} />
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/">
                  <button className="p-2 bg-gray-100 rounded-xl text-gray-600">
                    <Home size={16} />
                  </button>
                </Link>
                <button
                  onClick={() => setShowCart(true)}
                  className="p-2 bg-[#1A1612] rounded-xl text-white flex items-center gap-2"
                >
                  <ShoppingCart size={16} />
                  <span className="text-xs font-bold">
                    السلة ({totalItems})
                  </span>
                </button>
              </>
            )}
          </div>
          <h1 className="text-base font-black italic text-[#1A1612]">
            نقطة البيع
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* قسم المنتجات */}
      <div
        className={`flex-1 overflow-y-auto border-l border-[#E8D5A3]/30 transition-all duration-300 ${
          showCart ? "hidden lg:block" : "block"
        } mt-14 lg:mt-0`}
      >
        <div className="p-3 sm:p-4 md:p-6">
          <div className="hidden lg:flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/">
                <button className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl transition-colors">
                  <ArrowRight className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </Link>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-[#1A1612] to-[#2A241E] rounded-xl sm:rounded-2xl shadow-lg">
                <Receipt className="text-[#C9A962] w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black italic">
                نقطة البيع السريع
              </h1>
            </div>
            <div className="relative w-56 md:w-72 lg:w-80">
              <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو الباركود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl py-2 sm:py-3 pr-9 sm:pr-10 pl-3 sm:pl-4 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm transition-all"
              />
            </div>
          </div>

          <div className="lg:hidden relative mb-3">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#E8D5A3]/30 rounded-xl py-2.5 pr-9 pl-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs transition-all"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 opacity-20">
              <Loader2 className="animate-spin w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {filtered.map((p: any) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(p)}
                  className="bg-white border border-[#E8D5A3]/40 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm cursor-pointer hover:shadow-lg hover:border-[#C9A962] transition-all group relative"
                >
                  <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-[#FAF3E8] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[7px] sm:text-[8px] font-black text-[#9A7B3C] uppercase tracking-wider">
                    {p.currentStock}
                  </div>
                  <div className="w-full aspect-square bg-gradient-to-br from-[#FAF3E8]/80 to-[#F5EBE0]/50 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 md:mb-4 flex items-center justify-center text-[#9A7B3C] group-hover:scale-105 transition-transform">
                    <Package
                      size={28}
                      className="sm:w-8 sm:h-8 md:w-10 md:h-10"
                      strokeWidth={1.2}
                    />
                  </div>
                  <h3 className="font-black text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">
                    {p.productName}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-[#C9A962] font-black text-sm sm:text-base md:text-lg">
                      {calculatePrice(p.sellPrice, p.currency).toLocaleString()}
                    </p>
                    <span className="text-[7px] sm:text-[8px] font-bold text-gray-400">
                      {selectedCurrency}
                    </span>
                  </div>
                  {p.sku && (
                    <div className="flex items-center gap-0.5 mt-1 text-[7px] text-gray-400">
                      <Barcode size={8} />
                      <span className="truncate">{p.sku}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* قسم السلة */}
      <div
        className={`w-full lg:w-[380px] xl:w-[420px] bg-white shadow-2xl flex flex-col relative z-10 border-r border-[#E8D5A3]/30 transition-all duration-300 ${
          showCart ? "block" : "hidden lg:flex"
        } mt-14 lg:mt-0 h-[calc(100vh-56px)] lg:h-screen`}
      >
        <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <ShoppingCart className="text-[#C9A962] w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-lg sm:text-xl font-black italic">
              قائمة البيع
            </h2>
            {totalItems > 0 && (
              <span className="ml-auto bg-[#C9A962] text-[#1A1612] px-2 py-0.5 rounded-full text-xs font-black">
                {totalItems}
              </span>
            )}
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="space-y-1">
              <label className="text-[8px] sm:text-[10px] font-black text-[#C9A962] uppercase tracking-widest flex items-center gap-1">
                <User size={10} className="sm:w-3 sm:h-3" /> اسم العميل
              </label>
              <input
                type="text"
                placeholder="عميل نقدي"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg sm:rounded-xl py-1.5 sm:py-2 px-3 sm:px-4 outline-none focus:border-[#C9A962] text-white text-xs sm:text-sm font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] sm:text-[10px] font-black text-[#C9A962] uppercase tracking-widest flex items-center gap-1">
                <DollarSign size={10} className="sm:w-3 sm:h-3" /> العملة
              </label>
              {/* 👈 زر التشغيل والإيقاف السحري */}
              <div className="flex justify-end mb-1 mt-1">
                <button
                  onClick={() => setIsAutoCalc(!isAutoCalc)}
                  className={`text-[8px] sm:text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-all ${
                    isAutoCalc
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <RefreshCw
                    size={10}
                    className={isAutoCalc ? "animate-spin-slow" : ""}
                  />
                  {isAutoCalc ? "حساب آلي: شغال" : "حساب آلي: متوقف"}
                </button>
              </div>
              <select
                value={selectedCurrency}
                onChange={(e) =>
                  setSelectedCurrency(e.target.value as "YER" | "SAR" | "USD")
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg sm:rounded-xl py-1.5 sm:py-2 px-3 sm:px-4 outline-none focus:border-[#C9A962] text-white text-xs sm:text-sm font-bold appearance-none"
              >
                <option value="YER" className="text-black">
                  🇾🇪 ريال يمني (YER)
                </option>
                <option value="SAR" className="text-black">
                  🇸🇦 ريال سعودي (SAR)
                </option>
                <option value="USD" className="text-black">
                  🇺🇸 دولار أمريكي (USD)
                </option>
              </select>
            </div>

            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex-1 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all ${
                  paymentMethod === "cash"
                    ? "bg-[#C9A962] text-[#1A1612]"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <Banknote size={12} className="sm:w-3.5 sm:h-3.5" /> نقدي
              </button>
              <button
                onClick={() => setPaymentMethod("credit")}
                className={`flex-1 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all ${
                  paymentMethod === "credit"
                    ? "bg-[#C9A962] text-[#1A1612]"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <CreditCard size={12} className="sm:w-3.5 sm:h-3.5" /> آجل
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
          <AnimatePresence>
            {cart.length === 0 ? (
              <div className="text-center py-16 sm:py-20 opacity-30 flex flex-col items-center">
                <ShoppingCart
                  size={48}
                  className="sm:w-12 sm:h-12 md:w-16 md:h-16"
                  strokeWidth={1}
                />
                <p className="font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-3">
                  السلة فارغة
                </p>
                <p className="text-[8px] sm:text-[10px] text-gray-400 mt-1">
                  اضغط على المنتجات لإضافتها
                </p>
              </div>
            ) : (
              cart.map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="flex items-center gap-2 sm:gap-3 bg-[#FFFBF7] p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-[#E8D5A3]/20"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#FAF3E8] to-[#F5EBE0] rounded-lg sm:rounded-xl flex items-center justify-center text-[#9A7B3C] shrink-0">
                    <Package size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-[10px] sm:text-xs truncate">
                      {item.productName}
                    </h4>
                    <p className="text-[8px] sm:text-[10px] font-bold text-[#C9A962]">
                      {calculatePrice(
                        item.sellPrice,
                        item.currency,
                      ).toLocaleString()}{" "}
                      {selectedCurrency}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg sm:rounded-xl border border-[#E8D5A3]/30 p-0.5 sm:p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-0.5 sm:p-1 hover:text-rose-500 transition-colors"
                    >
                      <Minus size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                    <span className="font-black text-[10px] sm:text-xs w-3 sm:w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-0.5 sm:p-1 hover:text-emerald-500 transition-colors"
                    >
                      <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 sm:p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-t from-[#FAF3E8] to-white border-t border-[#E8D5A3]/30 space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Package size={10} className="sm:w-3 sm:h-3" />
              عدد الأصناف
            </span>
            <span>{cart.length}</span>
          </div>
          <div className="flex justify-between items-center text-gray-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Calculator size={10} className="sm:w-3 sm:h-3" />
              عدد القطع
            </span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#E8D5A3]/20">
            <span className="text-sm sm:text-base font-black italic text-[#1A1612]">
              الإجمالي النهائي
            </span>
            <div className="text-right">
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-[#C9A962]">
                {total.toLocaleString()}
              </p>
              <p className="text-[8px] sm:text-[10px] font-bold text-[#9A7B3C]">
                {getCurrencySymbol(selectedCurrency)}
              </p>
            </div>
          </div>

          <button
            disabled={cart.length === 0 || isSubmitting}
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 border border-[#C9A962]/30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>جاري المعالجة...</span>
              </>
            ) : (
              <>
                <Eye
                  size={16}
                  className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#C9A962]"
                />
                <span>معاينة الفاتورة وإتمام البيع</span>
              </>
            )}
          </button>

          {cart.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCart([])}
                className="flex-1 text-[8px] sm:text-[10px] font-bold text-gray-400 hover:text-rose-500 transition-colors py-1 border border-gray-200 rounded-lg hover:border-rose-200"
              >
                مسح السلة
              </button>
              <button
                onClick={fetchProducts}
                className="flex-1 text-[8px] sm:text-[10px] font-bold text-gray-400 hover:text-[#C9A962] transition-colors py-1 border border-gray-200 rounded-lg hover:border-[#C9A962] flex items-center justify-center gap-1"
              >
                <RefreshCw size={10} />
                تحديث
              </button>
            </div>
          )}
        </div>
      </div>

      {/* زر عائم للجوال */}
      {!showCart && cart.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowCart(true)}
          className="lg:hidden fixed bottom-4 left-4 right-4 bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white py-3 px-4 rounded-2xl shadow-2xl border border-[#C9A962]/30 flex items-center justify-between z-40"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart size={20} className="text-[#C9A962]" />
              <span className="absolute -top-2 -right-2 bg-[#C9A962] text-[#1A1612] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">
                {totalItems}
              </span>
            </div>
            <span className="text-sm font-black">عرض السلة</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-[#C9A962]">
              {total.toLocaleString()} {selectedCurrency}
            </span>
            <ChevronLeft size={20} className="text-[#C9A962]" />
          </div>
        </motion.button>
      )}
    </div>
  );
}
