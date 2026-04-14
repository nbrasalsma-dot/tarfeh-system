import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// دالة (GET) لجلب بيانات المتجر لعرضها في الواجهة
export async function GET() {
  try {
    // نبحث عن أول إعدادات في النظام
    const config = await prisma.systemConfig.findFirst();

    if (!config) {
      return NextResponse.json(
        { error: false, message: "لا توجد إعدادات بعد" },
        { status: 200 },
      );
    }

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error("🔥 خطأ سيادي في جلب إعدادات المتجر:", error);
    return NextResponse.json(
      { error: true, message: "حدث خطأ في السيرفر" },
      { status: 500 },
    );
  }
}

// دالة (POST) لاستقبال البيانات من الواجهة وحفظها في قاعدة البيانات
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. نبحث عن المتجر الرئيسي (Tenant)
    let tenant = await prisma.tenant.findFirst();

    // إذا كانت القاعدة جديدة تماماً، نخلق متجر افتراضي أولاً لتجنب الانهيار
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: body.storeNameAr || "متجر ترفة الرئيسي",
          licenseKey:
            "TRF-CORE-" +
            Math.random().toString(36).substring(2, 10).toUpperCase(),
        },
      });
    }

    // 2. نبحث إذا كان هناك إعدادات سابقة لنقوم بتحديثها، أو ننشئ جديدة
    const existingConfig = await prisma.systemConfig.findFirst();

    if (existingConfig) {
      // تحديث البيانات الموجودة (Update)
      const updatedConfig = await prisma.systemConfig.update({
        where: { id: existingConfig.id },
        data: {
          storeNameAr: body.storeNameAr,
          storeNameEn: body.storeNameEn,
          commercialRegister: body.commercialRegister,
          taxNumber: body.taxNumber,
          taxPercentage: body.taxPercentage
            ? parseFloat(body.taxPercentage)
            : 0,
          phone: body.phone,
          phone2: body.phone2,
          email: body.email,
          address: body.address,
          website: body.website,
          currency: body.currency,
        },
      });
      return NextResponse.json(
        { success: true, data: updatedConfig },
        { status: 200 },
      );
    } else {
      // إنشاء بيانات جديدة (Create)
      const newConfig = await prisma.systemConfig.create({
        data: {
          storeName: body.storeNameAr || "متجر ترفة", // 👈 هذا هو الحقل الناقص
          storeNameAr: body.storeNameAr,
          storeNameEn: body.storeNameEn,
          commercialRegister: body.commercialRegister,
          taxNumber: body.taxNumber,
          taxPercentage: body.taxPercentage
            ? parseFloat(body.taxPercentage)
            : 0,
          phone: body.phone,
          phone2: body.phone2,
          email: body.email,
          address: body.address,
          website: body.website,
          currency: body.currency || "YER",
          systemIdentity: "TRF_ID_" + Date.now(),
          secretToken: "SEC_" + Math.random().toString(36).substring(2),
          tenantId: tenant.id, // ربط الإعدادات بالمتجر
        },
      });
      return NextResponse.json(
        { success: true, data: newConfig },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("🔥 خطأ سيادي في حفظ إعدادات المتجر:", error);
    return NextResponse.json(
      { error: true, message: "فشل حفظ البيانات في القاعدة" },
      { status: 500 },
    );
  }
}
