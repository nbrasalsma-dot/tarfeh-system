"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Phone,
  MapPin,
  Notebook,
  Search,
  Loader2,
  X,
  UserPlus,
  ArrowLeft,
  Home,
  Percent,
  TrendingUp,
  Edit,
  Save,
  Download,
  FileText,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calculator,
  Filter,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  CreditCard,
  Wallet,
  Banknote,
  Building2,
  Tag,
  Star,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ مكون نافذة تعديل العمولة
const CommissionModal = ({ isOpen, onClose, supplier, onSave }: any) => {
  const [commissionRate, setCommissionRate] = useState(
    supplier?.commissionRate || 0,
  );
  const [commissionType, setCommissionType] = useState(
    supplier?.commissionType || "PERCENTAGE",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (supplier) {
      setCommissionRate(Number(supplier.commissionRate) || 0);
      setCommissionType(supplier.commissionType || "PERCENTAGE");
    }
  }, [supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(supplier.id, commissionRate, commissionType);
    setIsSubmitting(false);
    onClose();
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
            className="relative w-full max-w-[95%] sm:max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#C9A962]/20 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#E8D5A3]" />

            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-black text-[#1A1612]">
                  تعديل نسبة العمولة
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="bg-[#FDF8F2] p-4 rounded-2xl mb-4 border border-[#E8D5A3]/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#9A7B3C] to-[#C9A962] rounded-xl flex items-center justify-center text-white text-lg font-black">
                    {supplier?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#1A1612]">
                      {supplier?.name}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {supplier?.phone || "بدون هاتف"}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-[#9A7B3C] uppercase mb-1.5">
                    نسبة العمولة (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={commissionRate}
                      onChange={(e) =>
                        setCommissionRate(parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-[#FDF8F2] border border-[#E8D5A3] rounded-xl px-4 py-3 text-lg font-black text-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] outline-none transition-all text-left"
                      dir="ltr"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Percent size={18} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#9A7B3C] uppercase mb-1.5">
                    نوع العمولة
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCommissionType("PERCENTAGE")}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                        commissionType === "PERCENTAGE"
                          ? "bg-[#C9A962] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Percent size={14} className="inline mr-1" />
                      نسبة مئوية
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommissionType("FIXED")}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                        commissionType === "FIXED"
                          ? "bg-[#C9A962] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <DollarSign size={14} className="inline mr-1" />
                      مبلغ ثابت
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Save size={16} />
                        حفظ التعديلات
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ✅ مكون نافذة استخراج كشف الحساب
const StatementModal = ({ isOpen, onClose, supplier, transactions }: any) => {
  const [adjustments, setAdjustments] = useState<{ [key: string]: number }>({});
  const [notes, setNotes] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // حساب الإجماليات
  const totalSales = transactions.reduce(
    (sum: number, t: any) => sum + (Number(t.amount) || 0),
    0,
  );

  const totalCommission = transactions.reduce((sum: number, t: any) => {
    const rate = Number(supplier?.commissionRate) || 0;
    const amount = Number(t.amount) || 0;
    const adjustedAmount =
      adjustments[t.id] !== undefined ? adjustments[t.id] : amount;
    return sum + (adjustedAmount * rate) / 100;
  }, 0);

  const netAmount = totalSales - totalCommission;

  const handleAdjustment = (id: string, value: number) => {
    setAdjustments((prev) => ({ ...prev, [id]: value }));
  };

  const handleExportPDF = () => {
    setIsExporting(true);

    // إنشاء نافذة جديدة للطباعة
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      const date = new Date().toLocaleDateString("ar-YE");

      // بناء صفوف الجدول
      let tableRows = "";
      transactions.forEach((t: any) => {
        const adjustedAmount =
          adjustments[t.id] !== undefined
            ? adjustments[t.id]
            : Number(t.amount);
        const commissionAmount =
          (adjustedAmount * (Number(supplier?.commissionRate) || 0)) / 100;

        tableRows += `
        <tr>
          <td>${new Date(t.date).toLocaleDateString("ar-YE")}</td>
          <td>${t.description || (t.type === "sale" ? "مبيعات" : "مشتريات")}</td>
          <td>${adjustedAmount.toLocaleString()}</td>
          <td>${commissionAmount.toLocaleString()}</td>
        </tr>
      `;
      });

      printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>كشف حساب - ${supplier?.name}</title>
        <style>
          body {
            font-family: 'Arial', 'Tahoma', sans-serif;
            margin: 0;
            padding: 30px;
            direction: rtl;
            background: white;
          }
          .container {
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
            font-size: 28px;
            font-weight: bold;
            color: #C9A962;
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
            .container { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="store-name">متجر ترفة</div>
            <div>كشف حساب تاجر</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="info-row">
            <span class="info-label">التاجر:</span>
            <span>${supplier?.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">نسبة العمولة:</span>
            <span>${supplier?.commissionRate || 0}%</span>
          </div>
          <div class="info-row">
            <span class="info-label">تاريخ الاستخراج:</span>
            <span>${date}</span>
          </div>
          
          <div class="divider"></div>
          
          <table>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>البيان</th>
                <th>المبلغ (YER)</th>
                <th>العمولة (YER)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          
          <div class="divider"></div>
          
          <div class="info-row total-row">
            <span>إجمالي المبيعات:</span>
            <span>${totalSales.toLocaleString()} YER</span>
          </div>
          <div class="info-row total-row">
            <span>إجمالي العمولات:</span>
            <span>${totalCommission.toLocaleString()} YER</span>
          </div>
          <div class="info-row total-row">
            <span>الصافي المستحق:</span>
            <span>${netAmount.toLocaleString()} YER</span>
          </div>
          
          ${
            notes
              ? `
          <div class="divider"></div>
          <div class="info-row">
            <span class="info-label">ملاحظات:</span>
            <span>${notes}</span>
          </div>
          `
              : ""
          }
          
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

    setIsExporting(false);
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
            className="relative w-full max-w-[95%] sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#C9A962]/20"
          >
            <div className="sticky top-0 bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white p-4 sm:p-5 rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black">
                  كشف حساب - {supplier?.name}
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
              {/* ملخص سريع */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <p className="text-[10px] font-black text-emerald-600 uppercase">
                    المبيعات
                  </p>
                  <p className="text-lg font-black text-emerald-700">
                    {totalSales.toLocaleString()}
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <p className="text-[10px] font-black text-amber-600 uppercase">
                    العمولة ({supplier?.commissionRate || 0}%)
                  </p>
                  <p className="text-lg font-black text-amber-700">
                    {totalCommission.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#C9A962]/10 p-3 rounded-xl border border-[#C9A962]/30">
                  <p className="text-[10px] font-black text-[#9A7B3C] uppercase">
                    الصافي
                  </p>
                  <p className="text-lg font-black text-[#9A7B3C]">
                    {netAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* جدول المعاملات مع إمكانية التعديل */}
              <div className="mb-4">
                <p className="text-xs font-black text-[#9A7B3C] uppercase mb-2">
                  المعاملات (قابل للتعديل)
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {transactions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 text-sm">
                      لا توجد معاملات لهذا التاجر
                    </p>
                  ) : (
                    transactions.map((t: any) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 p-3 bg-[#FDF8F2] rounded-xl border border-[#E8D5A3]/30"
                      >
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#1A1612]">
                            {new Date(t.date).toLocaleDateString("ar-YE")} -{" "}
                            {t.description || "عملية مالية"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={Number(t.amount)}
                            onChange={(e) =>
                              handleAdjustment(
                                t.id,
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-24 bg-white border border-[#E8D5A3] rounded-lg px-2 py-1.5 text-xs font-bold text-[#C9A962] focus:ring-1 focus:ring-[#C9A962] outline-none text-left"
                            dir="ltr"
                          />
                          <span className="text-[10px] text-gray-500">YER</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ملاحظات */}
              <div className="mb-4">
                <label className="block text-[10px] font-black text-[#9A7B3C] uppercase mb-1.5">
                  ملاحظات على الكشف
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="أي ملاحظات إضافية تريد إضافتها للتقرير..."
                  className="w-full bg-[#FDF8F2] border border-[#E8D5A3] rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-[#C9A962]/50 focus:border-[#C9A962] outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex-1 py-3 bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#9A7B3C] text-white rounded-xl font-black text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <FileText size={16} />
                      تصدير PDF
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ✅ مكون بطاقة المورد للجوال
const MobileSupplierCard = ({
  supplier,
  onEditCommission,
  onViewStatement,
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-4 border border-[#E8D5A3]/30 shadow-sm"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-[#9A7B3C] to-[#C9A962] rounded-xl flex items-center justify-center text-white text-lg font-black shrink-0">
          {supplier.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-[#1A1612] truncate">
            {supplier.name}
          </h3>
          <p className="text-[10px] text-gray-500 flex items-center gap-1">
            <Phone size={10} /> {supplier.phone || "بدون هاتف"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase">العمولة</p>
          <p className="text-lg font-black text-[#C9A962]">
            {supplier.commissionRate || 0}%
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEditCommission(supplier)}
          className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-[#1A1612] rounded-xl text-[10px] font-black flex items-center justify-center gap-1"
        >
          <Edit size={12} />
          تعديل العمولة
        </button>
        <button
          onClick={() => onViewStatement(supplier)}
          className="flex-1 py-2 bg-gradient-to-r from-[#9A7B3C] to-[#C9A962] text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-1"
        >
          <FileText size={12} />
          كشف حساب
        </button>
      </div>
    </motion.div>
  );
};

export default function MerchantsPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [supplierTransactions, setSupplierTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    commissionRate: "0",
    commissionType: "PERCENTAGE",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/merchants");
      const data = await res.json();
      if (!data.error) setSuppliers(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSuppliers();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/merchants", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({
          name: "",
          phone: "",
          address: "",
          notes: "",
          commissionRate: "0",
          commissionType: "PERCENTAGE",
        });
        setIsAddModalOpen(false);
        fetchSuppliers();
      }
    } catch (err) {
      console.error("Error adding supplier:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCommission = async (
    id: string,
    commissionRate: number,
    commissionType: string,
  ) => {
    try {
      const res = await fetch("/api/merchants", {
        method: "PUT",
        body: JSON.stringify({ id, commissionRate, commissionType }),
      });
      if (res.ok) {
        fetchSuppliers();
      }
    } catch (err) {
      console.error("Error updating commission:", err);
    }
  };

  const handleViewStatement = async (supplier: any) => {
    setSelectedSupplier(supplier);
    try {
      const res = await fetch(`/api/sales`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSupplierTransactions(
          data.filter(
            (t: any) =>
              t.merchantId === supplier.id || t.merchantName === supplier.name,
          ),
        );
      } else {
        setSupplierTransactions([]);
      }
    } catch (err) {
      setSupplierTransactions([]);
    }
    setIsStatementModalOpen(true);
  };

  const filteredSuppliers = suppliers.filter(
    (s: any) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ✅ إصلاح: تحويل القيم إلى أرقام
  const totalCommission = suppliers.reduce(
    (sum: number, s: any) => sum + (Number(s.commissionRate) || 0),
    0,
  );

  const avgCommission =
    suppliers.length > 0 ? totalCommission / suppliers.length : 0;

  const maxCommission =
    suppliers.length > 0
      ? Math.max(...suppliers.map((s: any) => Number(s.commissionRate) || 0))
      : 0;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8] text-[#1A1612] selection:bg-[#C9A962]/20 selection:text-[#9A7B3C] pb-20">
      {/* نوافذ منبثقة */}
      <CommissionModal
        isOpen={isCommissionModalOpen}
        onClose={() => setIsCommissionModalOpen(false)}
        supplier={selectedSupplier}
        onSave={handleSaveCommission}
      />
      <StatementModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        supplier={selectedSupplier}
        transactions={supplierTransactions}
      />

      {/* شريط التنقل للجوال */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-[#E8D5A3]/30 px-3 py-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
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
            التجار والعمولات
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 bg-[#C9A962] rounded-xl text-white shadow-md shadow-[#C9A962]/20"
          >
            <UserPlus size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* الترويسة */}
        <div className="mb-5 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start sm:items-center gap-3 sm:gap-4"
          >
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/">
                <button className="p-2 sm:p-2.5 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-[#E8D5A3]/50 shadow-sm">
                  <ArrowRight className="text-[#1A1612] w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
            </div>
            <div className="p-2.5 sm:p-3 md:p-4 bg-gradient-to-br from-[#F5EBE0] to-[#E8D5A3] rounded-xl sm:rounded-2xl shadow-sm border border-[#C9A962]/20">
              <Users
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#9A7B3C]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#1A1612]">
                إدارة التجار{" "}
                <span className="text-[#C9A962] font-light text-lg sm:text-xl md:text-2xl">
                  | العمولات
                </span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-bold text-[#1A1612]/50 mt-1 sm:mt-2 flex items-center gap-2">
                <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A962]" />
                <span className="hidden sm:inline">
                  قاعدة بيانات شركاء النجاح وإدارة نسب العمولات.
                </span>
                <span className="sm:hidden">إدارة التجار ونسب العمولات</span>
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2.5 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-[#E8D5A3]/50"
            >
              <RefreshCw
                size={18}
                className={`text-gray-600 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsAddModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#9A7B3C] hover:from-[#1A1612] hover:to-[#2A241E] text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all duration-500 shadow-lg shadow-[#C9A962]/20"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              إضافة تاجر جديد
            </motion.button>
          </div>
        </div>

        {/* بطاقات إحصائية - ✅ إصلاح toFixed */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div className="p-1 sm:p-1.5 bg-[#C9A962]/20 rounded-lg">
                <Users size={12} className="sm:w-3.5 sm:h-3.5 text-[#9A7B3C]" />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                التجار
              </span>
            </div>
            <p className="text-base sm:text-lg font-black text-[#1A1612]">
              {suppliers.length}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div className="p-1 sm:p-1.5 bg-amber-100 rounded-lg">
                <Percent
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-amber-700"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                متوسط العمولة
              </span>
            </div>
            <p className="text-base sm:text-lg font-black text-[#1A1612]">
              {avgCommission.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div className="p-1 sm:p-1.5 bg-emerald-100 rounded-lg">
                <TrendingUp
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-emerald-700"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                أعلى عمولة
              </span>
            </div>
            <p className="text-base sm:text-lg font-black text-[#1A1612]">
              {maxCommission}%
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <div className="p-1 sm:p-1.5 bg-rose-100 rounded-lg">
                <Calculator
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-rose-700"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                إجمالي العمولات
              </span>
            </div>
            <p className="text-base sm:text-lg font-black text-[#1A1612]">
              {totalCommission.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ابحث عن تاجر بالاسم أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-sm border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3 pr-10 text-xs sm:text-sm focus:border-[#C9A962] outline-none transition-all"
            />
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 opacity-40">
            <Loader2 className="animate-spin mb-3 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10" />
            <p className="font-bold text-xs sm:text-sm uppercase tracking-widest">
              جاري جلب البيانات...
            </p>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20 bg-white/50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#C9A962]/20"
          >
            <div className="p-4 sm:p-6 bg-[#C9A962]/10 rounded-full w-fit mx-auto mb-4 sm:mb-6">
              <Users
                className="text-[#C9A962] w-12 h-12 sm:w-16 sm:h-16"
                strokeWidth={1}
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1A1612] mb-2">
              لا يوجد تجار حالياً
            </h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto mb-6 sm:mb-8 text-sm">
              ابدأ بإضافة أول تاجر لمتجرك لتبدأ في إدارة العمولات والكشوفات.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-[#C9A962] font-black underline decoration-2 underline-offset-8 text-sm"
            >
              إضافة تاجر الآن
            </button>
          </motion.div>
        ) : (
          <>
            {/* عرض الجوال - بطاقات */}
            <div className="block sm:hidden space-y-3">
              {filteredSuppliers.map((s: any) => (
                <MobileSupplierCard
                  key={s.id}
                  supplier={s}
                  onEditCommission={(supplier: any) => {
                    setSelectedSupplier(supplier);
                    setIsCommissionModalOpen(true);
                  }}
                  onViewStatement={handleViewStatement}
                />
              ))}
            </div>

            {/* عرض الكمبيوتر - شبكة */}
            <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredSuppliers.map((s: any) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white border border-[#E8D5A3]/40 p-5 md:p-6 rounded-2xl sm:rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A962]/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-[#C9A962]/10 transition-colors" />

                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#9A7B3C] to-[#C9A962] rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-black shadow-lg shadow-[#C9A962]/20">
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-[#1A1612] group-hover:text-[#C9A962] transition-colors">
                          {s.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          تاجر
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase">
                        العمولة
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-[#C9A962]">
                        {Number(s.commissionRate) || 0}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600">
                      <Phone size={14} className="text-[#C9A962]" />
                      {s.phone || "بدون هاتف"}
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600">
                      <MapPin size={14} className="text-[#C9A962]" />
                      <span className="truncate">
                        {s.address || "لا يوجد عنوان مسجل"}
                      </span>
                    </div>
                    {s.notes && (
                      <div className="flex items-start gap-2 text-[10px] sm:text-xs text-gray-400 font-medium pt-3 border-t border-gray-100">
                        <Notebook size={12} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{s.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 relative z-10">
                    <button
                      onClick={() => {
                        setSelectedSupplier(s);
                        setIsCommissionModalOpen(true);
                      }}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-[#1A1612] rounded-xl text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit size={12} />
                      تعديل العمولة
                    </button>
                    <button
                      onClick={() => handleViewStatement(s)}
                      className="flex-1 py-2 bg-gradient-to-r from-[#9A7B3C] to-[#C9A962] text-white rounded-xl text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 shadow-md"
                    >
                      <FileText size={12} />
                      كشف حساب
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* نافذة إضافة تاجر جديد */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[95%] sm:max-w-lg bg-white rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-[#9A7B3C] via-[#C9A962] to-[#E8D5A3]" />
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 left-4 sm:top-5 sm:left-5 text-gray-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-[#1A1612] italic mb-1">
                  إضافة تاجر
                </h2>
                <p className="text-gray-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest">
                  توسيع قاعدة بيانات ترفة
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase mr-2">
                    اسم التاجر *
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl px-4 py-2.5 sm:py-3 focus:border-[#C9A962] outline-none font-bold transition-all text-black text-sm"
                    placeholder="مثلاً: شركة مكة للتوريد"
                  />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase mr-2">
                    رقم الهاتف
                  </label>
                  <input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl px-4 py-2.5 sm:py-3 focus:border-[#C9A962] outline-none font-bold transition-all text-black text-sm"
                    placeholder="05xxxxxxxx"
                  />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase mr-2">
                    العنوان
                  </label>
                  <input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl px-4 py-2.5 sm:py-3 focus:border-[#C9A962] outline-none font-bold transition-all text-black text-sm"
                    placeholder="المدينة، الشارع، المبنى"
                  />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase mr-2">
                    نسبة العمولة (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.commissionRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionRate: e.target.value,
                      })
                    }
                    className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl px-4 py-2.5 sm:py-3 focus:border-[#C9A962] outline-none font-bold transition-all text-black text-sm text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-black text-[#9A7B3C] uppercase mr-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl px-4 py-2.5 sm:py-3 focus:border-[#C9A962] outline-none font-bold transition-all resize-none text-black text-sm"
                    placeholder="أي تفاصيل أخرى..."
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white py-3 sm:py-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-[0.1em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "حفظ التاجر في القاعدة"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
