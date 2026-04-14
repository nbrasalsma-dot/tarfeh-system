import { Client } from "pg"; // استخدام المحرك الخام مباشرة للتحرر من قيود المكتبات

/**
 * 🌍 محرك الاستيطان الشمولي (Universal Probe Engine) - الإصدار السيادي
 * وظيفة هذا المحرك هي اختراق أي قاعدة بيانات خارجية وفحص عروقها (جداولها)
 * بالاعتماد على المحركات الأصلية (Native Drivers) لضمان التوافق مع كل البيئات.
 */
export class UniversalProbe {
  private url: string;
  private dialect: "postgres" | "mysql" | "sqlite" | "unknown";

  constructor(databaseUrl: string) {
    this.url = databaseUrl;
    this.dialect = this.detectDialect(databaseUrl);
  }

  /**
   * 1. كاشف اللهجة (Dialect Detector)
   * يحلل الرابط لمعرفة نوع قاعدة البيانات وتحديد لغة التخاطب
   */
  private detectDialect(url: string) {
    if (url.startsWith("postgres") || url.startsWith("postgresql"))
      return "postgres";
    if (url.startsWith("mysql")) return "mysql";
    if (url.startsWith("sqlite") || url.includes(".db")) return "sqlite";
    return "unknown";
  }

  /**
   * 2. المستكشف الخام (The Raw Explorer)
   * يتصل مباشرة بالقاعدة باستخدام المحرك الأصلي ويجلب الجداول كبيانات خام
   */
  async getExternalSchema() {
    if (this.dialect === "postgres") {
      // استخدام محرك pg الأصلي للتعامل مع PostgreSQL
      const client = new Client({
        connectionString: this.url,
        connectionTimeoutMillis: 10000, // مهلة 10 ثوانٍ للفحص
      });

      try {
        await client.connect();

        // استعلام سيادي خام لجلب مسميات الجداول (يعمل على أي قاعدة Postgres في العالم)
        const query = `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
        `;

        const res = await client.query(query);

        // توحيد المخرجات لمصفوفة نصوص بسيطة
        return res.rows.map((row) => row.table_name);
      } catch (error: any) {
        console.error("🔥 فشل الرادار الخام في اختراق القاعدة:", error.message);
        throw new Error(`تعذر الاتصال بالقاعدة الخارجية: ${error.message}`);
      } finally {
        // قطع الاتصال فوراً لضمان سيادة الموارد وعدم بقاء خيوط مفتوحة
        await client.end();
      }
    }

    // ملاحظة: هنا يمكن إضافة محركات MySQL و SQLite لاحقاً بنفس الطريقة الخام
    else {
      throw new Error(
        `نوع القاعدة (${this.dialect}) سيتوفر دعمه قريباً في محرك الاستيطان.`,
      );
    }
  }

  /**
   * 3. فحص النبض (Health Check)
   * فحص سريع للتأكد من أن الرابط "ابن ناس" وشغال قبل الحفظ
   */
  async testConnection() {
    if (this.dialect === "postgres") {
      const client = new Client({
        connectionString: this.url,
        connectionTimeoutMillis: 5000,
      });

      try {
        await client.connect();
        await client.query("SELECT 1"); // استعلام النبض
        return true;
      } catch (err) {
        return false;
      } finally {
        await client.end();
      }
    }
    return false;
  }
}
