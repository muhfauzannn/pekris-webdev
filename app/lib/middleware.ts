import { NextRequest } from "next/server";
import { validateApiKey } from "./auth";

export async function authenticateRequest(
  request: NextRequest
): Promise<string | null> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  return await validateApiKey(token);
}

export function createErrorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
