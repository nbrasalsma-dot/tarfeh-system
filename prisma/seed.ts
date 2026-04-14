import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import * as bcrypt from "bcrypt";
import "dotenv/config";
// إعداد المحول يدوياً للمرة الأخيرة في ملف البذرة
const connectionString = process.env.DATABASE_URL as string;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  console.log("⏳ جاري صب القواعد وتعميد الملك...");

  // 1. إنشاء المتجر الرئيسي (شركة ترفة)
  const tenant = await prisma.tenant.upsert({
    where: { licenseKey: "TARFEH-2026-VIP" },
    update: {},
    create: {
      name: "مجموعة ترفة التجارية",
      licenseKey: "TARFEH-2026-VIP",
      maxEmployees: 100,
    },
  });

  // 2. إنشاء حسابك كملك للنظام (Super Admin)
  await prisma.user.upsert({
    where: { email: "admin@tarfeh.com" },
    update: {},
    create: {
      email: "admin@tarfeh.com",
      name: "المدير العام",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      tenantId: tenant.id,
    },
  });

  console.log("✅ تمت زراعة الملك بنجاح! يمكنك الآن تجربة الدخول.");
}

main()
  .catch((e) => {
    console.error("❌ خطأ في الزراعة:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
