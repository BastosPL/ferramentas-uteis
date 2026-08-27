import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GONE_PATHS = new Set([
  "/cronometro",
  "/gerador-lorem-ipsum",
  "/gerador-cores",
  "/validador-email",
  "/conversor-texto",
  "/conversor-de-unidades",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (GONE_PATHS.has(pathname)) {
    return new NextResponse(null, { status: 410, statusText: "Gone" });
  }
}

export const config = {
  matcher: [
    "/cronometro",
    "/gerador-lorem-ipsum",
    "/gerador-cores",
    "/validador-email",
    "/conversor-texto",
    "/conversor-de-unidades",
  ],
};
