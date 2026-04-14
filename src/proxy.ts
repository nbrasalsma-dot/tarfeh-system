import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  // 1. قراءة الـ Cookie الخاص بالجلسة
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  // 2. إذا كان المستخدم غير مسجل دخول ويحاول دخول الداشبورد، ارجعه للوجن
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. إذا كان المستخدم مسجل دخول ويحاول دخول صفحة اللوجن، ارجعه للداشبورد
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // السماح بالمرور
  return NextResponse.next();
}

export const config = {
  // تحديد المسارات التي سيراقبها الحارس (نتجاهل الصور وملفات الـ API)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
