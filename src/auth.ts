import NextAuth from "next-auth";
import { authConfig } from "./auth.config"; // استيراد الإعدادات الخفيفة
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";
import * as bcrypt from "bcryptjs"; // استخدمنا bcryptjs لضمان التوافق

const connectionString = process.env.DATABASE_URL as string;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // دمج الإعدادات الخفيفة
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        console.log("🔍 محاولة فحص للمستخدم:", credentials.email);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { tenant: true },
        });

        if (!user) {
          console.log("❌ خطأ: المستخدم غير موجود في القاعدة");
          return null;
        }

        console.log("✅ مستخدم موجود، جاري فحص كلمة السر...");

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          console.log("❌ خطأ: كلمة السر غير متطابقة!");
          return null;
        }

        if (!user.tenant?.isActive || !user.isActive) {
          console.log("❌ خطأ: الحساب أو المتجر معطل (isActive: false)");
          return null;
        }

        console.log("🎉 تم الدخول بنجاح يا ملك!");
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.tenantId = token.tenantId;
      }
      return session;
    },
  },
});
