// lib/cors.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function handleCors(request: NextRequest) {
  const origin = request.headers.get("origin") || "*";

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}