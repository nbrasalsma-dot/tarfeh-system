import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // استخدمنا (any) مؤقتاً لتجنب خطأ الانهيار حتى نقوم بتصميم الجداول في Prisma
    const productsCount =
      (await (prisma as any).product?.count().catch(() => 0)) || 0;
    const suppliersCount =
      (await (prisma as any).supplier?.count().catch(() => 0)) || 0;
    const transactionsCount =
      (await (prisma as any).transaction?.count().catch(() => 0)) || 0;

    return NextResponse.json(
      {
        products: productsCount,
        suppliers: suppliersCount,
        transactions: transactionsCount,
        error: false,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("🔥 خطأ في جلب إحصائيات الداشبورد:", error);
    return NextResponse.json(
      { error: true, products: 0, suppliers: 0, transactions: 0 },
      { status: 500 },
    );
  }
}
