import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. جلب أسعار الصرف الحالية
export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const rates = await prisma.currencyRate.findMany({
      where: { tenantId: session.user.tenantId },
    });
    return NextResponse.json(rates);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب البيانات" }, { status: 500 });
  }
}

// 2. تحديث أو إضافة أسعار صرف جديدة
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const body = await req.json(); // يتوقع مصفوفة من العملات [ {fromCurrency, toCurrency, rate} ]

    // استخدام "المعاملات" (Transactions) لضمان حفظ كل شيء أو لا شيء
    const results = await prisma.$transaction(
      body.map((item: any) =>
        prisma.currencyRate.upsert({
          where: {
            // ملاحظة: نحتاج لتعريف معرف فريد في الـ Schema لاحقاً إذا لزم الأمر،
            // لكن حالياً سنستخدم البحث بالعملة والمرجع للمتجر
            id: item.id || "new_id",
          },
          update: { rate: item.rate, updatedBy: session.user.name },
          create: {
            fromCurrency: item.fromCurrency,
            toCurrency: item.toCurrency,
            rate: item.rate,
            tenantId: session.user.tenantId!,
            updatedBy: session.user.name,
          },
        }),
      ),
    );

    // تسجيل العملية في سجل الرقابة (Audit Log)
    await prisma.auditLog.create({
      data: {
        action: "تحديث أسعار الصرف",
        details: `تم تحديث أسعار العملات: ${body.map((b: any) => `${b.fromCurrency}: ${b.rate}`).join(", ")}`,
        userId: session.user.id!,
        userName: session.user.name!,
        tenantId: session.user.tenantId!,
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "فشل الحفظ" }, { status: 500 });
  }
}
