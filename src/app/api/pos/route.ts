import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const body = await req.json();
    const { items, customerName, totalAmount, currency, referenceId } = body;

    // عملية بيع داخل "Transaction" لضمان تنفيذ كل الخطوات أو فشلها بالكامل
    const result = await prisma.$transaction(async (tx) => {
      // 1. تحديث المخزون لكل منتج في الفاتورة
      for (const item of items) {
        const product = await tx.productInventory.findUnique({
          where: { id: item.id },
        });

        if (!product || product.currentStock < item.quantity) {
          throw new Error(
            `الكمية غير كافية للمنتج: ${product?.productName || "غير معروف"}`,
          );
        }

        await tx.productInventory.update({
          where: { id: item.id },
          data: {
            currentStock: { decrement: item.quantity },
            quantity: { decrement: item.quantity }, // تحديث الحقلين معاً كما في الـ Schema الوافية
          },
        });
      }

      // 2. تسجيل العملية المالية في جدول القيود
      const newTransaction = await tx.transaction.create({
        data: {
          referenceId: referenceId || `SALE-${Date.now()}`,
          type: "sale",
          amount: totalAmount,
          currency: currency || "SAR",
          merchantName: customerName || "عميل نقدي",
          description: `بيع أصناف عدد (${items.length}) عبر نقطة البيع`,
          tenantId: session.user.tenantId,
        } as any,
      });

      return newTransaction;
    });

    return NextResponse.json({ success: true, transaction: result });
  } catch (error: any) {
    console.error("POS Error:", error);
    return NextResponse.json(
      { error: error.message || "فشل إتمام عملية البيع" },
      { status: 400 },
    );
  }
}
