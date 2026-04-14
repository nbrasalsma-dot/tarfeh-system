import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const transactions = await prisma.transaction.findMany({
      where: { tenantId: session.user.tenantId }, // سحبنا كل العمليات لكي تشتغل فلاتر شاشتك الجديدة
      orderBy: { date: "desc" },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "فشل الجلب" }, { status: 500 });
  }
}
