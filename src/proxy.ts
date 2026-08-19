import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "./lib/jwt";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl; // sudah otomatis TANPA basePath

    // Allow login page
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    const token = request.cookies.get("auth-session")?.value;

    if (!token) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        return NextResponse.redirect(loginUrl);
    }

    try {
        await jwtVerify(token);
        return NextResponse.next();
    } catch {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ["/admin/:path*", "/admin"],
};