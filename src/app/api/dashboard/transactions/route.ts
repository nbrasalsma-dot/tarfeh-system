import { NextResponse } from "next/server";
// مسار الاتصال بقاعدة البيانات - تأكد منه حسب هيكلة مشروعك
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // جلب آخر العمليات المالية من قاعدة البيانات
    // نستخدم take: 100 لجلب عدد كافي للداشبورد عشان تحسب الإجمالي صح
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: "desc", // ترتيب من الأحدث للأقدم
      },
      take: 100,
    });

    // إذا لم تكن هناك عمليات، نرجع مصفوفة فارغة بسلاسة
    if (!transactions || transactions.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // "الذكاء التحويلي": بما أن أسماء الحقول قد تختلف قليلاً في الـ Schema حقك،
    // هذا الكود يضمن مطابقتها تماماً مع ما تنتظره واجهة الداشبورد (page.tsx)
    const formattedTransactions = transactions.map((tx: any) => ({
      id: tx.id,
      description: tx.description || tx.notes || "عملية مالية",
      amount: tx.amount || tx.totalPrice || tx.total || 0,
      currency: tx.currency || "YER",
      type: tx.type || "sale", // أنواع العمليات: sale (بيع), purchase (شراء), expense (مصروف)
      date: tx.createdAt || tx.date || new Date(),
      referenceId:
        tx.referenceId ||
        tx.invoiceNumber ||
        `TRX-${tx.id.toString().substring(0, 6)}`,
      merchantName: tx.merchantName || tx.customerName || "عميل نقدي",
    }));

    // إرسال الزلط للواجهة!
    return NextResponse.json(formattedTransactions, { status: 200 });
  } catch (error) {
    console.error("🔥 خطأ سيادي في جلب العمليات المالية:", error);

    // في حال الخطأ (مثلاً الجدول عاد احنا ما سوينا له Migrate)،
    // نرجع بيانات فارغة عشان الواجهة تظل صامدة وما تنهار
    return NextResponse.json(
      { error: true, message: "فشل الاتصال بجدول العمليات" },
      { status: 500 },
    );
  }
}
