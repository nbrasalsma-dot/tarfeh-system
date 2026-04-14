import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import * as bcrypt from "bcryptjs";
import "dotenv/config";

// إعداد المحول يدوياً للمرة الأخيرة في ملف البذرة
const connectionString = process.env.DATABASE_URL as string;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // التعديل الجراحي: كلمة المرور الجديدة والقوية
  const hashedPassword = await bcrypt.hash(
    "Tarifa.store.yetarifa.store.ye777",
    10,
  );

  console.log("⏳ جاري صب القواعد وتعميد الملك بالبيانات السيادية الجديدة...");

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

  // 2. إنشاء حسابك كملك للنظام (Super Admin) بالبريد الجديد
  await prisma.user.upsert({
    where: { email: "nbrask711@gmail.com" }, // 👈 البريد الجديد هنا
    update: {},
    create: {
      email: "nbrask711@gmail.com", // 👈 والبريد الجديد هنا
      name: "المدير العام",
      password: hashedPassword,
      phone: "777777777",
      role: "ADMIN",
      accountingRole: "SUPER_ADMIN",
      tenantId: tenant.id,
    },
  });

  console.log("✅ تمت زراعة الملك بنجاح! الإيميل: nbrask711@gmail.com");
  console.log("✅ يمكنك الآن تجربة الدخول بالباسورد الجديد فور انتهاء الرفع.");
}

main()
  .catch((e) => {
    console.error("❌ خطأ في الزراعة:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
