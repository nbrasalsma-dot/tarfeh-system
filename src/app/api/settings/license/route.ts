import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// دالة (GET) لجلب بيانات الترخيص الحقيقية وإحصائيات القاعدة
export async function GET() {
  try {
    const tenant = await prisma.tenant.findFirst();

    if (!tenant) {
      return NextResponse.json(
        { error: true, message: "لم يتم العثور على ترخيص نشط" },
        { status: 404 },
      );
    }

    // جلب إحصائيات حقيقية من قاعدة البيانات
    const usersCount = await prisma.user.count();
    const productsCount = await prisma.productInventory.count();
    const transactionsCount = await prisma.transaction.count();
    const suppliersCount = await prisma.supplier.count();

    const totalRecords =
      usersCount + productsCount + transactionsCount + suppliersCount;

    // محاكاة لحجم قاعدة البيانات بناءً على عدد السجلات (للعرض التوضيحي)
    const estimatedSizeMB = Math.max(1.5, totalRecords * 0.05).toFixed(2);

    const licenseData = {
      status: tenant.isActive ? "نشط" : "غير نشط",
      owner: tenant.name,
      key: tenant.licenseKey,
      plan: "الباقة الإمبراطورية (مدى الحياة)",
      activationDate: tenant.createdAt.toISOString().split("T")[0],
      expiryDate: tenant.validUntil
        ? tenant.validUntil.toISOString().split("T")[0]
        : "2099-12-31",
      databaseSize: `${estimatedSizeMB} MB`,
      tables: 9, // عدد الجداول الفعلي في دستور النظام
      records: totalRecords,
      version: "2.1.0 (نسخة الاستقرار)",
    };

    return NextResponse.json(licenseData, { status: 200 });
  } catch (error) {
    console.error("🔥 خطأ في جلب بيانات الرخصة:", error);
    return NextResponse.json(
      { error: true, message: "فشل جلب بيانات النظام" },
      { status: 500 },
    );
  }
}

// دالة (POST) لمعالجة طلبات النسخ الاحتياطي (Backup)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { format } = body; // نتوقع "sql" أو "json"

    // في البيئة الحقيقية، هنا تقوم بتشغيل أوامر pg_dump أو سحب البيانات
    // سنقوم هنا بمحاكاة سحب البيانات بصيغة JSON كعينة للعميل

    if (format === "json") {
      // سحب جميع بيانات النظام للنسخة الاحتياطية
      const users = await prisma.user.findMany();
      const products = await prisma.productInventory.findMany();
      const transactions = await prisma.transaction.findMany();
      const suppliers = await prisma.supplier.findMany();
      const expenses = await prisma.expense.findMany();
      const systemConfig = await prisma.systemConfig.findFirst();
      const tenant = await prisma.tenant.findFirst();

      const backupPayload = {
        timestamp: new Date().toISOString(),
        metadata: {
          version: "2.1.0",
          format: "json",
          tenant: tenant?.name || "Tarfee",
        },
        data: {
          users,
          products,
          transactions,
          suppliers,
          expenses,
          systemConfig,
        },
      };

      // تحويل البيانات إلى JSON string
      const jsonString = JSON.stringify(backupPayload, null, 2);
      const fileName = `tarfeh_backup_${new Date().toISOString().split("T")[0]}.json`;

      // إرجاع الملف للتحميل
      return new NextResponse(jsonString, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    }

    // إنشاء نسخة SQL
    const users = await prisma.user.findMany();
    const products = await prisma.productInventory.findMany();
    const tenant = await prisma.tenant.findFirst();

    // بناء محتوى SQL
    let sqlContent = `-- Tarfeh Accounting System Backup
-- Generated: ${new Date().toISOString()}
-- Tenant: ${tenant?.name || "Tarfee"}
-- ============================================

`;

    // إنشاء INSERT statements للمستخدمين
    sqlContent += `-- Users Table\n`;
    users.forEach((user: any) => {
      sqlContent += `INSERT INTO "User" (id, email, name, role, "isActive", "tenantId", "createdAt", "updatedAt") VALUES ('${user.id}', '${user.email}', '${user.name}', '${user.role}', ${user.isActive}, '${user.tenantId}', '${user.createdAt.toISOString()}', '${user.updatedAt.toISOString()}');\n`;
    });

    sqlContent += `\n-- Products Table\n`;
    products.forEach((product: any) => {
      sqlContent += `INSERT INTO "ProductInventory" (id, "productName", "externalId", "costPrice", "currentStock", "tenantId", "createdAt", "updatedAt") VALUES ('${product.id}', '${(product.productName || "").replace(/'/g, "''")}', '${product.externalId}', ${product.costPrice || 0}, ${product.currentStock || 0}, '${product.tenantId}', '${product.createdAt.toISOString()}', '${product.updatedAt.toISOString()}');\n`;
    });

    const fileName = `tarfeh_backup_${new Date().toISOString().split("T")[0]}.sql`;

    // إرجاع الملف للتحميل
    return new NextResponse(sqlContent, {
      headers: {
        "Content-Type": "application/sql",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("🔥 خطأ في عملية النسخ الاحتياطي:", error);
    return NextResponse.json(
      { error: true, message: "فشل إنشاء النسخة الاحتياطية" },
      { status: 500 },
    );
  }
}
