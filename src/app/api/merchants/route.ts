import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. جلب قائمة الموردين
export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
  }

  try {
    const suppliers = await prisma.supplier.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json({ error: "فشل في جلب الموردين" }, { status: 500 });
  }
}

// 2. إضافة مورد جديد
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, address, notes, commissionRate, commissionType } =
      body;

    if (!name) {
      return NextResponse.json({ error: "اسم المورد مطلوب" }, { status: 400 });
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        phone,
        address,
        notes,
        commissionRate: commissionRate ? parseFloat(commissionRate) : 0,
        commissionType: commissionType || "PERCENTAGE",
        tenantId: session.user.tenantId,
      },
    });

    // تسجيل العملية في سجل المراقبة
    await prisma.auditLog.create({
      data: {
        action: "إضافة مورد",
        details: `تم إضافة المورد: ${name} بنسبة عمولة ${commissionRate || 0}%`,
        userId: session.user.id || "system",
        userName: session.user.name || "النظام",
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json(newSupplier);
  } catch (error) {
    console.error("خطأ في إضافة المورد:", error);
    return NextResponse.json({ error: "فشل في إضافة المورد" }, { status: 500 });
  }
}

// 3. تحديث نسبة العمولة للمورد
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, commissionRate, commissionType } = body;

    if (!id) {
      return NextResponse.json({ error: "معرف المورد مطلوب" }, { status: 400 });
    }

    // التحقق من وجود المورد
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        id: id,
        tenantId: session.user.tenantId,
      },
    });

    if (!existingSupplier) {
      return NextResponse.json({ error: "المورد غير موجود" }, { status: 404 });
    }

    // تحديث المورد
    const updatedSupplier = await prisma.supplier.update({
      where: { id: id },
      data: {
        commissionRate:
          commissionRate !== undefined ? parseFloat(commissionRate) : undefined,
        commissionType: commissionType || undefined,
      },
    });

    // تسجيل العملية في سجل المراقبة
    await prisma.auditLog.create({
      data: {
        action: "تحديث عمولة مورد",
        details: `تم تحديث نسبة عمولة المورد: ${existingSupplier.name} إلى ${commissionRate}%`,
        userId: session.user.id || "system",
        userName: session.user.name || "النظام",
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json(updatedSupplier);
  } catch (error) {
    console.error("خطأ في تحديث المورد:", error);
    return NextResponse.json({ error: "فشل في تحديث المورد" }, { status: 500 });
  }
}

// 4. حذف مورد
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف المورد مطلوب" }, { status: 400 });
    }

    // التحقق من وجود المورد
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        id: id,
        tenantId: session.user.tenantId,
      },
    });

    if (!existingSupplier) {
      return NextResponse.json({ error: "المورد غير موجود" }, { status: 404 });
    }

    // حذف المورد
    await prisma.supplier.delete({
      where: { id: id },
    });

    // تسجيل العملية في سجل المراقبة
    await prisma.auditLog.create({
      data: {
        action: "حذف مورد",
        details: `تم حذف المورد: ${existingSupplier.name}`,
        userId: session.user.id || "system",
        userName: session.user.name || "النظام",
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json({ success: true, message: "تم حذف المورد بنجاح" });
  } catch (error) {
    console.error("خطأ في حذف المورد:", error);
    return NextResponse.json({ error: "فشل في حذف المورد" }, { status: 500 });
  }
}
