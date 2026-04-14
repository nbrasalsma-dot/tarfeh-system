import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. الفحص السيادي: اختبار الاتصال الفعلي بقاعدة البيانات
    let dbStatus = false;
    try {
      // نرسل استعلام بسيط جداً لفحص النبض
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = true;
    } catch (dbError) {
      console.error("⚠️ قاعدة البيانات غير متصلة:", dbError);
      dbStatus = false;
    }

    // 2. حالة الـ API (بما أن هذا الملف استجاب، فالـ API يعمل)
    const apiStatus = true;

    // 3. حالة التخزين (محاكاة يمكن ربطها بمساحة السيرفر لاحقاً)
    const storageStatus = true;

    // 4. تاريخ آخر نسخة احتياطية (مؤقتاً نعطيه تاريخ اليوم، ولاحقاً نربطه بجدول النسخ)
    const now = new Date();
    const lastBackupDate = now.toISOString().slice(0, 16).replace("T", " ");

    // 5. إرسال التقرير الشامل لواجهة الإعدادات
    return NextResponse.json(
      {
        systemStatus: {
          database: dbStatus,
          api: apiStatus,
          storage: storageStatus,
        },
        lastBackup: lastBackupDate,
        license: {
          status: "ساري",
          expiresAt: "2026-12-31",
        },
        error: false,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("🔥 خطأ سيادي في جلب حالة النظام:", error);
    return NextResponse.json(
      {
        error: true,
        message: "فشل في جلب حالة النظام السيادية",
        systemStatus: { database: false, api: false, storage: false },
      },
      { status: 500 },
    );
  }
}
