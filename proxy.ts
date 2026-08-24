import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/app/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Admin login API
  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Protect admin pages
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    const session = await verifyAdminSession(token);

    if (!session) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );

      response.cookies.delete("admin_session");

      return response;
    }
  }

  // Protect admin APIs
  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const session = await verifyAdminSession(token);

    if (!session) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );

      response.cookies.delete("admin_session");

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};