import { NextResponse } from "next/server";
import swaggerSpec from "@/app/lib/swagger";
import { addCorsHeaders, handleCorsOptions } from "@/app/lib/cors";

export async function GET() {
  return addCorsHeaders(NextResponse.json(swaggerSpec));
}

export async function OPTIONS() {
  return handleCorsOptions();
}
