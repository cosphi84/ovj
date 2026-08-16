import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "./lib/jwt";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Allow login page
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    const token = request.cookies.get("auth-session")?.value;

    if (!token) {
        return NextResponse.redirect(
            new URL("/admin/login", request.url)
        );
    }

    try {
        await jwtVerify(token);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(
            new URL("/admin/login", request.url)
        );
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};