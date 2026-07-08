import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "ferramentautil.com.br";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.replace(/:\d+$/, "") || "";

  if (host !== CANONICAL_HOST && !host.startsWith("localhost")) {
    const url = new URL(request.url);
    url.hostname = CANONICAL_HOST;
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher:
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|xml|txt)).*)",
};
