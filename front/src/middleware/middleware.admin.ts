// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	// Intenta obtener el token o la sesión de las cookies
	const sessionToken = request.cookies.get("auth_token")?.value;

	// Define las rutas que quieres proteger
	const protectedPaths = ["/dashboard"];

	// Si el usuario intenta acceder a una ruta protegida sin token,
	// redirígelo al login.
	if (
		protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
		!sessionToken
	) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Aquí podrías añadir lógica para verificar el rol de admin decodificando el token
	// const userData = await getUserFromToken(sessionToken);
	// if (userData.role !== 'admin') {
	//   return NextResponse.redirect(new URL('/unauthorized', request.url));
	// }

	return NextResponse.next();
}

// Configura el matcher para que el middleware solo se ejecute en las rutas necesarias
export const config = {
	matcher: ["/dashboard/:path*"],
};
