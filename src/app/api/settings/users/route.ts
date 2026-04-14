import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ✅ جلب جميع الموظفين
export async function GET() {
  try {
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json([], { status: 200 });
    }

    const users = await prisma.user.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // تحويل البيانات لتتناسب مع واجهة المستخدم
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.email.split("@")[0],
      email: user.email,
      role: user.role === "ADMIN" ? "المدير العام" : "موظف",
      status: user.isActive ? "نشط" : "غير نشط",
      lastLogin: "لم يسجل دخول بعد",
      permissions: user.role === "ADMIN" ? "صلاحيات مطلقة" : "صلاحيات محدودة",
      phone: "",
      createdAt: user.createdAt,
    }));

    return NextResponse.json(formattedUsers, { status: 200 });
  } catch (error) {
    console.error("🔥 خطأ في جلب الموظفين:", error);
    return NextResponse.json(
      { error: true, message: "فشل جلب البيانات" },
      { status: 500 },
    );
  }
}

// ✅ إضافة موظف جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json(
        { error: true, message: "لا يوجد متجر مسجل" },
        { status: 400 },
      );
    }

    // التأكد من عدم تكرار الإيميل
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: true, message: "البريد الإلكتروني مسجل مسبقاً" },
        { status: 400 },
      );
    }

    // تحديد نوع الصلاحية
    let userRole: "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE" = "EMPLOYEE";
    if (body.role === "المدير العام") userRole = "ADMIN";

    // تشفير كلمة المرور
    const hashedPassword = body.password
      ? await bcrypt.hash(body.password, 10)
      : await bcrypt.hash("123456", 10); // كلمة مرور افتراضية

    // إنشاء الموظف الجديد
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        password: hashedPassword,
        role: "ADMIN",
        accountingRole: userRole as any,
        isActive: true,
        tenantId: tenant.id,
      } as any, // 👈 هذه "as any" هي اللي بتخلي Vercel يوافق ويمشي
    });

    // تسجيل الحدث في سجل المراقبة
    await prisma.auditLog.create({
      data: {
        action: "إضافة موظف",
        details: `تم إضافة الموظف الجديد: ${body.name} بصلاحية ${body.role}`,
        userId: "system",
        userName: "النظام",
        tenantId: tenant.id,
      },
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error("🔥 خطأ في إضافة الموظف:", error);
    return NextResponse.json(
      { error: true, message: "فشل إضافة الموظف" },
      { status: 500 },
    );
  }
}

// ✅ تحديث بيانات موظف (تعديل)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, role, phone, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: true, message: "معرف الموظف مطلوب" },
        { status: 400 },
      );
    }

    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json(
        { error: true, message: "لا يوجد متجر مسجل" },
        { status: 400 },
      );
    }

    // التحقق من وجود الموظف
    const existingUser = await prisma.user.findFirst({
      where: { id: id, tenantId: tenant.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: true, message: "الموظف غير موجود" },
        { status: 404 },
      );
    }

    // تحديد نوع الصلاحية
    let userRole: "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE" = "EMPLOYEE";
    if (role === "المدير العام") userRole = "ADMIN";

    // تحديث الموظف
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        name: name || existingUser.name,
        email: email || existingUser.email,
        role: userRole,
        isActive:
          status === "نشط"
            ? true
            : status === "غير نشط"
              ? false
              : existingUser.isActive,
      },
    });

    // تسجيل الحدث في سجل المراقبة
    await prisma.auditLog.create({
      data: {
        action: "تعديل موظف",
        details: `تم تعديل بيانات الموظف: ${updatedUser.name}`,
        userId: "system",
        userName: "النظام",
        tenantId: tenant.id,
      },
    });

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("🔥 خطأ في تحديث الموظف:", error);
    return NextResponse.json(
      { error: true, message: "فشل تحديث الموظف" },
      { status: 500 },
    );
  }
}

// ✅ حذف موظف
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: true, message: "معرف الموظف مطلوب" },
        { status: 400 },
      );
    }

    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json(
        { error: true, message: "لا يوجد متجر مسجل" },
        { status: 400 },
      );
    }

    // التحقق من وجود الموظف
    const existingUser = await prisma.user.findFirst({
      where: { id: id, tenantId: tenant.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: true, message: "الموظف غير موجود" },
        { status: 404 },
      );
    }

    // حذف الموظف
    await prisma.user.delete({
      where: { id: id },
    });

    // تسجيل الحدث في سجل المراقبة
    await prisma.auditLog.create({
      data: {
        action: "حذف موظف",
        details: `تم حذف الموظف: ${existingUser.name}`,
        userId: "system",
        userName: "النظام",
        tenantId: tenant.id,
      },
    });

    return NextResponse.json(
      { success: true, message: "تم حذف الموظف بنجاح" },
      { status: 200 },
    );
  } catch (error) {
    console.error("🔥 خطأ في حذف الموظف:", error);
    return NextResponse.json(
      { error: true, message: "فشل حذف الموظف" },
      { status: 500 },
    );
  }
}
