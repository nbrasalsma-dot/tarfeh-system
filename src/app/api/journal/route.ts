import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. جلب سجل القيود اليومية
export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const transactions = await prisma.transaction.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "فشل الجلب" }, { status: 500 });
  }
}

// 2. إضافة قيد مالي جديد
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const body = await req.json();
    const { referenceId, type, amount, currency, description, merchantName } =
      body;

    const newTransaction = await prisma.transaction.create({
      data: {
        referenceId,
        type, // 'sale', 'purchase', 'expense'
        amount: parseFloat(amount),
        currency,
        description,
        merchantName,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json(newTransaction);
  } catch (error) {
    console.error("خطأ في تسجيل القيد:", error);
    return NextResponse.json({ error: "فشل تسجيل العملية" }, { status: 500 });
  }
}
