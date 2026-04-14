import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ خطأ: لم يتم العثور على DATABASE_URL في ملف .env");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 جاري إزالة الحسابات القديمة والمعلقة...");

  try {
    // 1. مسح المستخدم القديم لتجنب التعارض
    await prisma.user.deleteMany({
      where: { email: "admin@tarfeh.com" },
    });

    // 2. مسح المتجر القديم
    await prisma.tenant.deleteMany({
      where: { id: "cl_master_tenant_01" },
    });

    console.log("✨ الساحة نظيفة! جاري بناء العرش من جديد...");

    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);
    const tenantId = "cl_master_tenant_01";

    // 3. إنشاء المتجر (مفعل إجبارياً)
    const tenant = await prisma.tenant.create({
      data: {
        id: tenantId,
        name: "متجر ترفة الرئيسي",
        licenseKey: "TRF-2026-DEV",
        isActive: true, // التفعيل الإجباري
      },
    });
    console.log("✅ تم إنشاء المتجر وتفعيله:", tenant.name);

    // 4. إنشاء المستخدم (مفعل إجبارياً)
    const admin = await prisma.user.create({
      data: {
        email: "admin@tarfeh.com",
        password: hashedPassword,
        name: "الأدمن الرئيسي",
        phone: "777777777", // 👈 الإضافة الجراحية هنا
        role: "ADMIN",
        accountingRole: "SUPER_ADMIN", // تأكد من وجود هذه أيضاً
        tenantId: tenant.id,
        isActive: true,
      },
    });

    console.log("✅ تم إنشاء حساب الأدمن وتفعيله بنجاح!");
    console.log("📧 البريد:", admin.email);
    console.log("🔑 كلمة السر: 123456");
  } catch (error) {
    console.error("❌ حدث خطأ أثناء التنظيف أو الإنشاء:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
