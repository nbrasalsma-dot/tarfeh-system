"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Search,
  Loader2,
  X,
  AlertTriangle,
  Tag,
  Barcode,
  Layers,
  ArrowDown,
  ArrowUp,
  ShoppingCart,
  Truck,
  Filter,
  ChevronRight,
  Box,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warehouse,
  BarChart3,
  Grid2x2,
  List,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Save,
  RefreshCw,
} from "lucide-react";
import { useSession } from "next-auth/react";

// --- مكون بطاقة المنتج للجوال (مصغر) ---
const MobileProductCard = ({ product, onEdit, onDelete }: any) => {
  const isLowStock = product.quantity <= product.minQuantity;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-2xl p-4 border shadow-sm relative ${
        isLowStock ? "border-rose-300" : "border-[#E8D5A3]/30"
      }`}
    >
      {/* زر القائمة للجوال */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreHorizontal size={16} className="text-gray-500" />
      </button>

      {/* قائمة منسدلة للجوال */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-12 right-3 bg-white rounded-xl shadow-xl border border-[#E8D5A3]/30 z-20 overflow-hidden"
          >
            <button
              onClick={() => {
                setShowMenu(false);
                onEdit(product);
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#FDF8F2] w-full whitespace-nowrap"
            >
              <Edit size={14} className="text-[#C9A962]" />
              تعديل المنتج
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                onDelete(product);
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 w-full whitespace-nowrap border-t border-gray-100"
            >
              <Trash2 size={14} />
              حذف المنتج
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        {/* أيقونة المنتج */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isLowStock
              ? "bg-rose-100 text-rose-600"
              : "bg-gradient-to-br from-[#FAF3E8] to-[#F5EBE0] text-[#9A7B3C]"
          }`}
        >
          <Package size={22} />
        </div>

        {/* معلومات المنتج */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-black text-[#1A1612] truncate">
              {product.productName}
            </h3>
            {isLowStock && (
              <span className="shrink-0 bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full text-[8px] font-black flex items-center gap-0.5">
                <AlertTriangle size={8} /> منخفض
              </span>
            )}
          </div>
          <p className="text-[9px] text-gray-400 font-bold uppercase truncate">
            {product.category || "بدون تصنيف"}
          </p>
        </div>
      </div>

      {/* تفاصيل المنتج */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-[#FDF8F2] p-2 rounded-xl">
          <p className="text-[7px] text-gray-400 font-black uppercase">
            الكمية
          </p>
          <p
            className={`text-base font-black ${isLowStock ? "text-rose-600" : "text-[#1A1612]"}`}
          >
            {product.quantity}
            <span className="text-[8px] text-gray-400 mr-1">قطعة</span>
          </p>
        </div>
        <div className="bg-[#FDF8F2] p-2 rounded-xl">
          <p className="text-[7px] text-gray-400 font-black uppercase">
            سعر البيع
          </p>
          <p className="text-base font-black text-[#C9A962]">
            {Number(product.sellPrice).toLocaleString()}
            <span className="text-[8px] text-gray-400 mr-1">
              {product.currency || "YER"}
            </span>
          </p>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Barcode size={10} className="text-gray-400" />
          <span className="text-[9px] font-mono text-gray-500">
            {product.sku || "بدون باركود"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Truck size={10} className="text-gray-400" />
          <span className="text-[9px] text-gray-500 truncate max-w-[80px]">
            {product.supplierName || "غير محدد"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function InventoryPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalValue: 0,
    categories: [] as string[],
  });

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: "",
    buyPrice: "",
    sellPrice: "",
    minQuantity: "5",
    supplierName: "",
    currency: "YER",
  });

  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    sku: "",
    category: "",
    quantity: "",
    buyPrice: "",
    sellPrice: "",
    minQuantity: "5",
    supplierName: "",
    currency: "YER",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. جلب البيانات
  const fetchData = async () => {
    try {
      const [resProd, resSup] = await Promise.all([
        fetch("/api/inventory"),
        fetch("/api/merchants"),
      ]);
      const dataProd = await resProd.json();
      const dataSup = await resSup.json();

      if (!dataProd.error) {
        setProducts(dataProd);
        // حساب الإحصائيات
        const lowStockCount = dataProd.filter(
          (p: any) => p.quantity <= p.minQuantity,
        ).length;
        const totalValue = dataProd.reduce(
          (sum: number, p: any) => sum + p.quantity * p.buyPrice,
          0,
        );
        const categories = [
          ...new Set(dataProd.map((p: any) => p.category).filter(Boolean)),
        ] as string[];

        setStats({
          totalProducts: dataProd.length,
          lowStock: lowStockCount,
          totalValue: totalValue,
          categories: categories,
        });
      }
      if (!dataSup.error) setSuppliers(dataSup);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted]);

  // 2. إضافة منتج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          name: "",
          sku: "",
          category: "",
          quantity: "",
          buyPrice: "",
          sellPrice: "",
          minQuantity: "5",
          supplierName: "",
          currency: "YER",
        });
        fetchData();
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. فتح نافذة التعديل
  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditFormData({
      id: product.id,
      name: product.productName || "",
      sku: product.sku || "",
      category: product.category || "",
      quantity: product.quantity?.toString() || "",
      buyPrice:
        product.buyPrice?.toString() || product.costPrice?.toString() || "",
      sellPrice: product.sellPrice?.toString() || "",
      minQuantity: product.minQuantity?.toString() || "5",
      supplierName: product.supplierName || "",
      currency: product.currency || "YER",
    });
    setIsEditModalOpen(true);
  };

  // 4. حفظ التعديلات
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/inventory/${editFormData.id}`, {
        method: "PUT",
        body: JSON.stringify(editFormData),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "فشل تحديث المنتج");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("فشل تحديث المنتج");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. فتح نافذة الحذف
  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // 6. تأكيد الحذف
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/inventory/${selectedProduct.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "فشل حذف المنتج");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("فشل حذف المنتج");
    } finally {
      setIsSubmitting(false);
    }
  };

  // تصفية المنتجات
  const filteredProducts = products.filter((p: any) => {
    const matchesSearch =
      p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F2] via-[#FFFBF7] to-[#FAF3E8]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* الترويسة - متجاوبة */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="p-2 sm:p-3 bg-gradient-to-br from-[#C9A962] to-[#E8D5A3] rounded-xl sm:rounded-2xl shadow-lg"
            >
              <Warehouse className="text-white w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1612] italic tracking-tight">
                المخزون والمستودع
              </h1>
              <p className="text-gray-500 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5 sm:mt-1">
                إدارة الأصناف والكميات اللحظية
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-[#C9A962] to-[#D4B36A] text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-xl shadow-[#C9A962]/20 flex items-center justify-center gap-2 sm:gap-3"
          >
            <Plus size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="whitespace-nowrap">صنف جديد</span>
          </motion.button>
        </div>

        {/* بطاقات الإحصائيات - متجاوبة */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <div className="p-1 sm:p-1.5 bg-[#C9A962]/20 rounded-lg">
                <Box
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#9A7B3C]"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                الأصناف
              </span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-black text-[#1A1612]">
              {stats.totalProducts}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 border backdrop-blur-sm ${
              stats.lowStock > 0
                ? "bg-rose-50/80 border-rose-200"
                : "bg-white/80 border-[#E8D5A3]/30"
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <div
                className={`p-1 sm:p-1.5 rounded-lg ${stats.lowStock > 0 ? "bg-rose-100" : "bg-gray-100"}`}
              >
                <AlertTriangle
                  size={12}
                  className={`sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${stats.lowStock > 0 ? "text-rose-600" : "text-gray-500"}`}
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                منخفضة
              </span>
            </div>
            <p
              className={`text-sm sm:text-base md:text-lg font-black ${stats.lowStock > 0 ? "text-rose-600" : "text-[#1A1612]"}`}
            >
              {stats.lowStock}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-2 sm:col-span-1 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[#E8D5A3]/30"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <div className="p-1 sm:p-1.5 bg-emerald-100 rounded-lg">
                <DollarSign
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-emerald-700"
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase">
                قيمة المخزون
              </span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-black text-[#1A1612]">
              {stats.totalValue.toLocaleString()}
              <span className="text-[8px] sm:text-[10px] font-medium text-gray-400 mr-1">
                YER
              </span>
            </p>
          </motion.div>
        </div>

        {/* شريط البحث والتصفية - متجاوب */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج أو الباركود..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-sm border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 pr-9 sm:pr-10 text-xs sm:text-sm focus:border-[#C9A962] outline-none transition-all"
            />
          </div>

          <div className="flex gap-2">
            {/* زر التصفية للجوال */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden px-3 py-2 bg-white/80 border border-[#E8D5A3]/30 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-1.5"
            >
              <Filter size={14} />
              تصفية
            </button>

            {/* أزرار عرض الجوال */}
            <div className="flex sm:hidden gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-[#C9A962] text-white" : "bg-white/80 text-gray-500"}`}
              >
                <Grid2x2 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? "bg-[#C9A962] text-white" : "bg-white/80 text-gray-500"}`}
              >
                <List size={14} />
              </button>
            </div>

            {/* أزرار التصنيفات - سطح المكتب */}
            <div className="hidden sm:flex gap-1.5 sm:gap-2">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                  filterCategory === "all"
                    ? "bg-[#C9A962] text-white shadow-md"
                    : "bg-white/60 text-gray-600 border border-[#E8D5A3]/30 hover:bg-white"
                }`}
              >
                الكل
              </button>
              {stats.categories.slice(0, 3).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                    filterCategory === cat
                      ? "bg-[#C9A962] text-white shadow-md"
                      : "bg-white/60 text-gray-600 border border-[#E8D5A3]/30 hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* قائمة التصنيفات للجوال */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden mb-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-[#E8D5A3]/30"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
              التصنيفات
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  setFilterCategory("all");
                  setShowFilters(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                  filterCategory === "all"
                    ? "bg-[#C9A962] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                الكل
              </button>
              {stats.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    setShowFilters(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                    filterCategory === cat
                      ? "bg-[#C9A962] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* عدد النتائج */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
            {filteredProducts.length} منتج
          </p>
          {filterCategory !== "all" && (
            <button
              onClick={() => setFilterCategory("all")}
              className="text-[10px] font-bold text-[#C9A962] flex items-center gap-1"
            >
              <X size={12} />
              إلغاء التصفية
            </button>
          )}
        </div>

        {/* عرض المحتوى */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 opacity-40">
            <Loader2 className="animate-spin mb-3 sm:mb-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
            <p className="font-bold text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              جاري جرد المستودع...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 sm:py-20 md:py-24 bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-[3rem] border-2 border-dashed border-[#C9A962]/20">
            <Package
              className="mx-auto mb-3 sm:mb-4 text-gray-300 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
              strokeWidth={1}
            />
            <p className="text-gray-500 font-bold text-sm sm:text-base">
              المستودع فارغ حالياً
            </p>
            <p className="text-gray-400 text-xs mt-1">
              ابدأ بإضافة أول منتج إلى المخزون
            </p>
          </div>
        ) : (
          <>
            {/* عرض الجوال - بطاقات */}
            <div
              className={`${viewMode === "grid" ? "block" : "hidden"} sm:hidden`}
            >
              <div className="space-y-2.5">
                {filteredProducts.map((p: any) => (
                  <MobileProductCard
                    key={p.id}
                    product={p}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>

            {/* عرض الجوال - قائمة */}
            <div
              className={`${viewMode === "list" ? "block" : "hidden"} sm:hidden`}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8D5A3]/30 divide-y divide-gray-100">
                {filteredProducts.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-3 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-black text-[#1A1612] truncate">
                        {p.productName}
                      </h3>
                      <p className="text-[9px] text-gray-400">
                        {p.quantity} قطعة
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-[#C9A962]">
                        {Number(p.sellPrice).toLocaleString()}{" "}
                        {p.currency || "YER"}
                      </p>
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit size={14} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* عرض الكمبيوتر - شبكة */}
            <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((p: any) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-[#E8D5A3]/40 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
                >
                  {p.quantity <= p.minQuantity && (
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-1 bg-rose-100 text-rose-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black animate-pulse">
                      <AlertTriangle size={10} className="sm:w-3 sm:h-3" /> كمية
                      منخفضة
                    </div>
                  )}

                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${
                        p.quantity <= p.minQuantity
                          ? "bg-rose-500 text-white shadow-rose-200"
                          : "bg-gradient-to-br from-[#FAF3E8] to-[#F5EBE0] text-[#9A7B3C]"
                      }`}
                    >
                      <Layers
                        size={24}
                        className="sm:w-6 sm:h-6 md:w-7 md:h-7"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-black text-[#1A1612] truncate">
                        {p.productName}
                      </h3>
                      <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
                        {p.category || "بدون تصنيف"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-[#FDF8F2] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-[#E8D5A3]/10">
                      <p className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase mb-1">
                        الكمية
                      </p>
                      <p
                        className={`text-lg sm:text-xl font-black ${
                          p.quantity <= p.minQuantity
                            ? "text-rose-600"
                            : "text-[#1A1612]"
                        }`}
                      >
                        {p.quantity}{" "}
                        <span className="text-[9px] sm:text-[10px] text-gray-400">
                          قطعة
                        </span>
                      </p>
                    </div>
                    <div className="bg-[#FDF8F2] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-[#E8D5A3]/10">
                      <p className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase mb-1">
                        الباركود
                      </p>
                      <p className="text-[10px] sm:text-xs font-mono font-bold text-gray-600 truncate">
                        {p.sku || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[7px] sm:text-[8px] text-gray-400 font-black uppercase">
                        سعر البيع
                      </p>
                      <p className="text-base sm:text-lg font-black text-[#C9A962]">
                        {Number(p.sellPrice).toLocaleString()}{" "}
                        <span className="text-[8px] sm:text-[10px]">
                          {p.currency || "YER"}
                        </span>
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-[7px] sm:text-[8px] text-gray-400 font-black uppercase">
                        المورد
                      </p>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-600 truncate max-w-[100px]">
                        {p.supplierName || "غير محدد"}
                      </p>
                    </div>
                  </div>

                  {/* أزرار الإجراءات السريعة - ✅ تم تعديلها لفتح نافذة التعديل */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-[#C9A962] hover:text-white transition-colors"
                      title="تعديل المنتج"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(p)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-rose-500 hover:text-white transition-colors"
                      title="حذف المنتج"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* نافذة الإضافة (Modal) - متجاوبة ومصغرة */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[95%] sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-4 sm:p-6 md:p-8 shadow-2xl border border-[#C9A962]/20"
            >
              <div className="absolute top-0 right-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[#C9A962] to-[#E8D5A3]" />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 sm:top-4 left-3 sm:left-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X
                  size={16}
                  className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400"
                />
              </button>

              <div className="mb-5 sm:mb-6 md:mb-8 mt-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1A1612] italic">
                  إضافة منتج للمخزن
                </h2>
                <p className="text-gray-400 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest mt-1">
                  تعبئة بيانات الصنف الجديد
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* اسم المنتج */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                    <Tag size={10} className="sm:w-3 sm:h-3" /> اسم المنتج *
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                    placeholder="اسم المنتج الفعلي"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* الباركود */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <Barcode size={10} className="sm:w-3 sm:h-3" /> الباركود /
                      SKU
                    </label>
                    <input
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                      placeholder="أو اتركه فارغاً"
                    />
                  </div>

                  {/* التصنيف */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <Layers size={10} className="sm:w-3 sm:h-3" /> التصنيف
                    </label>
                    <input
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                      placeholder="عطور، بخور، إلخ..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* الكمية */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <Box size={10} className="sm:w-3 sm:h-3" /> الكمية
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                      placeholder="0"
                    />
                  </div>

                  {/* حد التنبيه */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <AlertTriangle size={10} className="sm:w-3 sm:h-3" />{" "}
                      تنبيه عند
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.minQuantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minQuantity: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* سعر الشراء */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <TrendingDown size={10} className="sm:w-3 sm:h-3" /> سعر
                      الشراء
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.buyPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, buyPrice: e.target.value })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  {/* حقل اختيار العملة */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <DollarSign size={10} className="sm:w-3 sm:h-3" /> العملة
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm appearance-none"
                    >
                      <option value="YER">ريال يمني (YER)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="SAR">ريال سعودي (SAR)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {/* سعر البيع */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <TrendingUp size={10} className="sm:w-3 sm:h-3" /> سعر
                      البيع
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.sellPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, sellPrice: e.target.value })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* المورد */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                    <Truck size={10} className="sm:w-3 sm:h-3" /> المورد المعتمد
                  </label>
                  <select
                    value={formData.supplierName}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierName: e.target.value })
                    }
                    className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm appearance-none"
                  >
                    <option value="">بدون مورد محدد</option>
                    {suppliers.map((s: any) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-2 sm:gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex-[2] w-full bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 border border-[#C9A962]/30"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs">
                          جاري الحفظ...
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle
                          size={14}
                          className="sm:w-4 sm:h-4 text-[#C9A962]"
                        />
                        <span className="text-[10px] sm:text-xs">
                          تخزين الصنف
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة التعديل (Edit Modal) - ✅ جديدة */}
      <AnimatePresence>
        {isEditModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[95%] sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] p-4 sm:p-6 md:p-8 shadow-2xl border border-[#C9A962]/20"
            >
              <div className="absolute top-0 right-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[#C9A962] to-[#E8D5A3]" />

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-3 sm:top-4 left-3 sm:left-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X
                  size={16}
                  className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400"
                />
              </button>

              <div className="mb-5 sm:mb-6 md:mb-8 mt-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1A1612] italic">
                  تعديل المنتج
                </h2>
                <p className="text-gray-400 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest mt-1">
                  {selectedProduct.productName}
                </p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-5">
                {/* اسم المنتج */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                    <Tag size={10} className="sm:w-3 sm:h-3" /> اسم المنتج *
                  </label>
                  <input
                    required
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                    placeholder="اسم المنتج الفعلي"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* الباركود */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <Barcode size={10} className="sm:w-3 sm:h-3" /> الباركود /
                      SKU
                    </label>
                    <input
                      value={editFormData.sku}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          sku: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                      placeholder="أو اتركه فارغاً"
                    />
                  </div>

                  {/* التصنيف */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <Layers size={10} className="sm:w-3 sm:h-3" /> التصنيف
                    </label>
                    <input
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          category: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                      placeholder="عطور، بخور، إلخ..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* الكمية */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <Box size={10} className="sm:w-3 sm:h-3" /> الكمية
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editFormData.quantity}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          quantity: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                      placeholder="0"
                    />
                  </div>

                  {/* حد التنبيه */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <AlertTriangle size={10} className="sm:w-3 sm:h-3" />{" "}
                      تنبيه عند
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editFormData.minQuantity}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          minQuantity: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* سعر الشراء */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <TrendingDown size={10} className="sm:w-3 sm:h-3" /> سعر
                      الشراء
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={editFormData.buyPrice}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          buyPrice: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  {/* حقل اختيار العملة */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <DollarSign size={10} className="sm:w-3 sm:h-3" /> العملة
                    </label>
                    <select
                      value={editFormData.currency}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          currency: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm appearance-none"
                    >
                      <option value="YER">ريال يمني (YER)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="SAR">ريال سعودي (SAR)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {/* سعر البيع */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                      <TrendingUp size={10} className="sm:w-3 sm:h-3" /> سعر
                      البيع
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={editFormData.sellPrice}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          sellPrice: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* المورد */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-[#9A7B3C] uppercase flex items-center gap-1.5">
                    <Truck size={10} className="sm:w-3 sm:h-3" /> المورد المعتمد
                  </label>
                  <select
                    value={editFormData.supplierName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        supplierName: e.target.value,
                      })
                    }
                    className="w-full bg-[#FFFBF7] border border-[#E8D5A3]/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[#C9A962] font-bold text-black text-xs sm:text-sm appearance-none"
                  >
                    <option value="">بدون مورد محدد</option>
                    {suppliers.map((s: any) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-2 sm:gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex-[2] w-full bg-gradient-to-r from-[#1A1612] to-[#2A241E] text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 border border-[#C9A962]/30"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs">
                          جاري الحفظ...
                        </span>
                      </>
                    ) : (
                      <>
                        <Save
                          size={14}
                          className="sm:w-4 sm:h-4 text-[#C9A962]"
                        />
                        <span className="text-[10px] sm:text-xs">
                          حفظ التعديلات
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة تأكيد الحذف (Delete Modal) - ✅ جديدة */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#C9A962]/20"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
                  <Trash2 size={28} className="text-rose-600" />
                </div>
                <h3 className="text-xl font-black text-[#1A1612] mb-2">
                  تأكيد الحذف
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  هل أنت متأكد من حذف المنتج "{selectedProduct.productName}"؟
                  <br />
                  <span className="text-rose-500 text-xs font-bold">
                    هذا الإجراء لا يمكن التراجع عنه.
                  </span>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <>
                        <Trash2 size={16} />
                        تأكيد الحذف
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
