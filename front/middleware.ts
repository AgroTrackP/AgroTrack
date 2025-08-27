// middleware.ts (ahora en la carpeta raíz 'front/')

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
	const token = request.cookies.get("auth_token")?.value;

	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {
		const secret = new TextEncoder().encode(
			process.env.JWT_SECRET || "tu_secreto_por_defecto"
		);
		const { payload } = await jwtVerify(token, secret);
		const userRole = payload.role as string;

		if (userRole !== "Admin") {
			return NextResponse.redirect(new URL("/", request.url));
		}

		return NextResponse.next();
	} catch (error) {
		console.error("JWT verification error:", error);
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

export const config = {
	matcher: ["/dashboard", "/dashboard/:path*"],
};
