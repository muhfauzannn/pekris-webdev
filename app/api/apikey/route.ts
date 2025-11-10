import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { generateRawApiKey } from "@/app/lib/auth";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * /api/apikey:
 *   post:
 *     summary: Generate new API key
 *     description: Creates a new API key that can be used to authenticate API requests
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Optional name for the API key
 *                 example: "My API Key"
 *     responses:
 *       201:
 *         description: API key created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier for the API key
 *                 key:
 *                   type: string
 *                   description: The generated API key (only shown once)
 *                 name:
 *                   type: string
 *                   description: Name of the API key
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    // Generate raw key untuk ditampilkan ke user
    const rawKey = await generateRawApiKey();

    // Hash key untuk disimpan di database
    const hashedKey = await bcrypt.hash(rawKey, 10);

    const apiKey = await prisma.apiKey.create({
      data: {
        key: hashedKey,
        name: name || null,
      },
    });

    return Response.json({
      id: apiKey.id,
      key: rawKey, // Return raw key to user (this is the only time they'll see it)
      name: apiKey.name,
      createdAt: apiKey.createdAt,
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    return Response.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/apikey:
 *   get:
 *     summary: List all API keys
 *     description: Get a list of all API keys with their metadata (keys are not returned for security)
 *     tags: [Authentication]
 *     security: []
 *     responses:
 *       200:
 *         description: List of API keys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   _count:
 *                     type: object
 *                     properties:
 *                       mataKuliah:
 *                         type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            mataKuliah: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(apiKeys);
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return Response.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}
