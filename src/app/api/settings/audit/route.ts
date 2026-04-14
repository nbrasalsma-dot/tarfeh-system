import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // التقاط المتغيرات من الرابط (عشان نعرف إذا المستخدم يشتي بيانات عادية للواجهة أو يشتي يطبع PDF)
    const { searchParams } = new URL(request.url);
    const exportFormat = searchParams.get("export");

    // 1. جلب المتجر
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json([], { status: 200 });
    }

    // 2. جلب سجل النشاطات الحقيقي من قاعدة البيانات (آخر 100 حركة)
    const dbLogs = await prisma.auditLog.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // 3. دالة مساعدة لتصنيف الحركات (عشان تظهر الألوان المناسبة في الواجهة زي ما صممناها)
    const mapCategoryAndType = (action: string) => {
      if (
        action.includes("دخول") ||
        action.includes("صلاحيات") ||
        action.includes("موظف")
      ) {
        return { category: "security", type: "info" };
      }
      if (action.includes("بيع") || action.includes("فاتورة")) {
        return {
          category: "sales",
          type: action.includes("حذف") ? "danger" : "success",
        };
      }
      if (
        action.includes("مخزون") ||
        action.includes("منتج") ||
        action.includes("جرد")
      ) {
        return { category: "inventory", type: "success" };
      }
      return { category: "system", type: "warning" };
    };

    // 4. تنسيق البيانات لتتناسب مع الواجهة اللي بنيناها
    const formattedLogs = dbLogs.map((log) => {
      const { category, type } = mapCategoryAndType(log.action);
      const dateObj = new Date(log.createdAt);

      return {
        id: log.id,
        user: log.userName,
        userRole: "موظف", // مستقبلاً يمكن جلبها بالربط مع جدول المستخدمين
        action: log.action,
        details: log.details || "بدون تفاصيل",
        category,
        type,
        time: dateObj.toLocaleTimeString("ar-YE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: dateObj.toLocaleDateString("ar-YE"),
        ip: "127.0.0.1", // قيمة افتراضية حتى نضيف تسجيل الـ IP مستقبلاً
        device: "متصفح",
      };
    });

    // ==========================================================
    // 🖨️ دالة تصدير الـ PDF (السر المهني)
    // ==========================================================
    if (exportFormat === "pdf") {
      // نبني صفحة HTML فخمة وجاهزة للطباعة فوراً
      const htmlContent = `
        <html dir="rtl" lang="ar">
          <head>
            <meta charset="utf-8">
            <title>سجل المراقبة والنشاطات - ترفة</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1A1612; }
              .header { text-align: center; border-bottom: 2px solid #C9A962; padding-bottom: 20px; margin-bottom: 30px; }
              h1 { color: #9A7B3C; margin: 0; font-size: 24px; }
              .date-info { color: #666; font-size: 14px; margin-top: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background-color: #FDF8F2; color: #9A7B3C; padding: 12px; text-align: right; border: 1px solid #E8D5A3; font-size: 14px; }
              td { padding: 10px; border: 1px solid #E8D5A3; font-size: 13px; }
              .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body onload="window.print()">
            <div class="header">
              <h1>سجل المراقبة والنشاطات (Audit Log)</h1>
              <div class="date-info">تاريخ استخراج التقرير: ${new Date().toLocaleString("ar-YE")}</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th width="15%">التاريخ والوقت</th>
                  <th width="15%">المستخدم</th>
                  <th width="20%">نوع العملية</th>
                  <th width="50%">التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                ${formattedLogs
                  .map(
                    (log) => `
                  <tr>
                    <td dir="ltr" style="text-align: right;">${log.date} ${log.time}</td>
                    <td><b>${log.user}</b></td>
                    <td>${log.action}</td>
                    <td>${log.details}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="footer">
              تم استخراج هذا التقرير من النظام المحاسبي (ترفة) - جميع الحقوق محفوظة
            </div>
          </body>
        </html>
      `;

      // إرجاع الـ HTML للمتصفح ليقوم بطباعته كـ PDF
      return new NextResponse(htmlContent, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    // إرجاع البيانات العادية بصيغة JSON للواجهة
    return NextResponse.json(formattedLogs, { status: 200 });
  } catch (error) {
    console.error("🔥 خطأ في جلب سجل المراقبة:", error);
    return NextResponse.json(
      { error: true, message: "فشل جلب البيانات" },
      { status: 500 },
    );
  }
}

// دالة (POST) خفية نستخدمها لاحقاً عشان نسجل أي حركة تقع في النظام (مثلاً لو انحذفت فاتورة نرسل لهنا)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const tenant = await prisma.tenant.findFirst();
    if (!tenant) return NextResponse.json({ error: true }, { status: 400 });

    const newLog = await prisma.auditLog.create({
      data: {
        action: body.action,
        details: body.details,
        userId: body.userId || "system",
        userName: body.userName || "النظام",
        tenantId: tenant.id,
      },
    });

    return NextResponse.json({ success: true, data: newLog }, { status: 201 });
  } catch (error) {
    console.error("🔥 خطأ في تسجيل حركة المراقبة:", error);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
