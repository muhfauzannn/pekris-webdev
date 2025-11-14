import { createCorsResponse, handleCorsOptions } from "@/app/lib/cors";

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running properly
 *     tags: [System]
 *     security: []
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 */
export async function GET() {
  return createCorsResponse({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
}

export async function OPTIONS() {
  return handleCorsOptions();
}
