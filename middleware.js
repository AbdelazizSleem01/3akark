import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const middleware = async (req) => {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token")?.value;

  const isPublic = PUBLIC_ROUTES.some((path) => url.pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "secret")
    );

    const role = payload.role;
    const perms = payload.permissions || {};

    // 🔐 منع غير الأدمن من صفحة المستخدمين
    if (url.pathname.startsWith("/users") && role !== "admin") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // 🔐 الطلبات فقط للأدمن أو المشرف
    if (
      url.pathname.startsWith("/requests") &&
      !["admin", "moderator"].includes(role)
    ) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // 🔐 إنشاء عقار
    if (
      url.pathname.startsWith("/properties/create") &&
      role !== "admin" &&
      !perms.create
    ) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // 🔐 تعديل عقار
    if (
      url.pathname.match(/^\/properties\/[^\/]+\/edit/) &&
      role !== "admin" &&
      !perms.update
    ) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    // 🔐 حذف عقار (API فقط)
    if (
      url.pathname.match(/^\/api\/properties\/[^\/]+\/delete/) &&
      role !== "admin" &&
      !perms.delete
    ) {
      return NextResponse.json(
        { error: "غير مصرح بالحذف" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT Error:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
};

export default middleware;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/requests/:path*",
    "/properties",
    "/properties/create",
    "/properties/:path*",
    "/api/properties/:path*",
    "/profile/:path*",
    "/",
  ],
};
