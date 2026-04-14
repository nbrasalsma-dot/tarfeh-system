import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UniversalProbe } from "@/lib/engines/universal-probe";

/**
 * 1. جلب قائمة الاتصالات الخارجية (المواقع المستوطنة)
 * وظيفتها عرض المواقع المرتبطة حالياً في الواجهة الذهبية.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
  }

  try {
    const connections = await prisma.externalConnection.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { createdAt: "desc" },
    });

    // تحويل البيانات لكي تشمل عداد الجداول (tablesCount) للواجهة
    const formattedConnections = connections.map((conn) => ({
      ...conn,
      tablesCount: Array.isArray(conn.detectedTables)
        ? conn.detectedTables.length
        : 0,
    }));

    return NextResponse.json(formattedConnections);
  } catch (error) {
    console.error("🔥 خطأ في جلب الاتصالات:", error);
    return NextResponse.json(
      { error: "فشل في جلب قائمة الاتصالات" },
      { status: 500 },
    );
  }
}

/**
 * 2. إنشاء "اتصال استيطان" جديد باستخدام المحرك الشمولي
 * هذه هي الدالة الجبارة التي تقتحم أي قاعدة بيانات (PHP, Python, etc.) وتفحصها.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { connectionName, databaseUrl, authFileId } = body;

    // فحص المدخلات الأساسية
    if (!connectionName || !databaseUrl || !authFileId) {
      return NextResponse.json(
        { error: "جميع الحقول (الاسم، الرابط، الهوية) مطلوبة" },
        { status: 400 },
      );
    }

    // 🚀 [استخدام المحرك الشمولي]: فحص القاعدة الخارجية بأي لغة كانت
    let detectedTables: string[] = [];
    try {
      const probe = new UniversalProbe(databaseUrl);

      // تنفيذ الفحص الذكي (The Probe) واكتشاف الجداول آلياً
      detectedTables = await probe.getExternalSchema();

      console.log(
        `✅ محرك الاستيطان اكتشف ${detectedTables.length} جدول في القاعدة الخارجية.`,
      );
    } catch (probeError: any) {
      console.error("⚠️ فشل المحرك الشمولي:", probeError.message);
      return NextResponse.json(
        { error: `الرابط لم يستجب! السبب: ${probeError.message}` },
        { status: 400 },
      );
    }

    // 💾 حفظ الاتصال في قاعدة بيانات ترفة بعد نجاح الفحص الشمولي
    const newConnection = await prisma.externalConnection.create({
      data: {
        connectionName,
        databaseUrl,
        authFileId,
        status: "ACTIVE",
        detectedTables: detectedTables, // حفظ الجداول المكتشفة كـ JSON للربط اللاحق
        tenantId: session.user.tenantId,
      },
    });

    // تسجيل العملية في سجل الرقابة السيادي (Audit Log)
    await prisma.auditLog.create({
      data: {
        action: "استيطان شمولي ناجح",
        details: `تم ربط الموقع: ${connectionName}. تم اكتشاف ${detectedTables.length} جدول.`,
        userId: session.user.id || "system",
        userName: session.user.name || "الإمبراطور",
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json({
      message: "تم الاستيطان بنجاح عبر المحرك الشمولي!",
      connection: newConnection,
      tablesCount: detectedTables.length,
    });
  } catch (error: any) {
    console.error("🔥 خطأ في محرك الاستيطان:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "رقم الهوية (Auth ID) مسجل مسبقاً لموقع آخر!" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع في محرك الاستيطان." },
      { status: 500 },
    );
  }
}

/**
 * 3. حذف اتصال (فك الارتباط الاستيطاني)
 * وظيفتها إنهاء السيطرة على الموقع الخارجي وحذفه من السجلات.
 */
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "معرف الاتصال مطلوب" },
        { status: 400 },
      );
    }

    await prisma.externalConnection.delete({
      where: {
        id: id,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم فك الارتباط بنجاح",
    });
  } catch (error) {
    console.error("🔥 خطأ في حذف الاتصال:", error);
    return NextResponse.json({ error: "فشل في حذف الاتصال" }, { status: 500 });
  }
}
