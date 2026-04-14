import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// استدعاء المحرك من المسار المخصص اللي حددناه
import { PrismaClient } from "../generated/prisma";

const connectionString = process.env.DATABASE_URL as string;

// تجهيز المحول الخاص بـ PostgreSQL للإصدار السابع
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// حيلة برمجية عشان Next.js ما يفتحش ألف اتصال وقت التطوير
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// تمرير المحول (Adapter) إجبارياً داخل الأقواس
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
