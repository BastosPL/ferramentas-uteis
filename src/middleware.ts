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

const REDIRECTS: Record<string, string> = {
  "/imagem-para-pdf": "/juntar-pdf",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (GONE_PATHS.has(pathname)) {
    return new NextResponse(null, { status: 410, statusText: "Gone" });
  }

  if (pathname in REDIRECTS) {
    const url = request.nextUrl.clone();
    url.pathname = REDIRECTS[pathname];
    return NextResponse.redirect(url, 301);
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
    "/imagem-para-pdf",
  ],
};
