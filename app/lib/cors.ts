/**
 * CORS Headers Configuration
 * Allows all origins to access the API
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400", // 24 hours
};

/**
 * Create a Response with CORS headers
 */
export function createCorsResponse(data: any, init?: ResponseInit): Response {
  const response = Response.json(data, init);
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Add CORS headers to an existing Response
 */
export function addCorsHeaders(response: Response): Response {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Handle preflight OPTIONS requests
 */
export function handleCorsOptions(): Response {
  return new Response(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/**
 * Wrapper for API route handlers that automatically adds CORS headers
 */
export function withCors(
  handler: (request: Request, ...args: any[]) => Promise<Response>
) {
  return async (request: Request, ...args: any[]): Promise<Response> => {
    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return handleCorsOptions();
    }

    try {
      const response = await handler(request, ...args);

      // Add CORS headers to the response
      Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      // Even error responses should have CORS headers
      const errorResponse = Response.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );

      Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });

      return errorResponse;
    }
  };
}
