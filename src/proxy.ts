import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "./lib/jwt";

// ---- Route rules ------------------------------------------------------
type RouteRule = {
    pattern: RegExp;
    methods?: string[]; // kalau diisi, hanya method ini yang public. kalau undefined, semua method public.
};

const PUBLIC_ROUTES: RouteRule[] = [
    { pattern: /^\/admin\/login$/ },
    { pattern: /^\/api\/auth\/login$/ },
    { pattern: /^\/api\/categories$/ },
    { pattern: /^\/api\/jobs$/ },
    // /api/jobs/[id] -> GET public, method lain (PATCH, dll) private
    { pattern: /^\/api\/jobs\/[^/]+$/, methods: ["GET"] },
];

function isPublicRoute(pathname: string, method: string): boolean {
    return PUBLIC_ROUTES.some(({ pattern, methods }) => {
        if (!pattern.test(pathname)) return false;
        if (!methods) return true;
        return methods.includes(method);
    });
}

// ---- Middleware ---------------------------------------------------------
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const method = request.method;
    const isApi = pathname.startsWith("/api/");

    if (isPublicRoute(pathname, method)) {
        return NextResponse.next();
    }

    const token = request.cookies.get("auth-session")?.value;

    if (!token) {
        if (isApi) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        return NextResponse.redirect(loginUrl);
    }

    try {
        await jwtVerify(token);
        return NextResponse.next();
    } catch {
        if (isApi) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ["/admin/:path*", "/admin", "/api/:path*"],
};