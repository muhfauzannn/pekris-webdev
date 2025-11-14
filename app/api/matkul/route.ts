import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { authenticateRequest, createErrorResponse } from "@/app/lib/middleware";
import {
  createCorsResponse,
  handleCorsOptions,
  addCorsHeaders,
} from "@/app/lib/cors";

/**
 * @swagger
 * /api/matkul:
 *   get:
 *     summary: Get all mata kuliah
 *     description: Retrieve all mata kuliah associated with the authenticated API key
 *     tags: [Mata Kuliah]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of mata kuliah
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MataKuliah'
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  const apiKeyId = await authenticateRequest(request);
  if (!apiKeyId) {
    return addCorsHeaders(createErrorResponse("Unauthorized", 401));
  }

  try {
    const mataKuliah = await prisma.mataKuliah.findMany({
      where: {
        apiKeyId: apiKeyId,
      },
      include: {
        _count: {
          select: {
            tugas: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return addCorsHeaders(Response.json(mataKuliah));
  } catch (error) {
    console.error("Error fetching mata kuliah:", error);
    return addCorsHeaders(
      createErrorResponse("Failed to fetch mata kuliah", 500)
    );
  }
}

/**
 * @swagger
 * /api/matkul:
 *   post:
 *     summary: Create new mata kuliah
 *     description: Create a new mata kuliah associated with the authenticated API key
 *     tags: [Mata Kuliah]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - sks
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Name of the mata kuliah
 *                 example: "Pemrograman Web"
 *               deskripsi:
 *                 type: string
 *                 description: Description of the mata kuliah
 *                 example: "Mata kuliah tentang pengembangan web"
 *               sks:
 *                 type: integer
 *                 minimum: 1
 *                 description: SKS (Satuan Kredit Semester) value
 *                 example: 3
 *     responses:
 *       201:
 *         description: Mata kuliah created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MataKuliah'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  const apiKeyId = await authenticateRequest(request);
  if (!apiKeyId) {
    return addCorsHeaders(createErrorResponse("Unauthorized", 401));
  }

  try {
    const body = await request.json();
    const { nama, deskripsi, sks } = body;

    if (!nama || !sks) {
      return addCorsHeaders(
        createErrorResponse("Name and SKS are required", 400)
      );
    }

    if (typeof sks !== "number" || sks <= 0) {
      return addCorsHeaders(
        createErrorResponse("SKS must be a positive number", 400)
      );
    }

    const mataKuliah = await prisma.mataKuliah.create({
      data: {
        nama,
        deskripsi: deskripsi || null,
        sks,
        apiKeyId,
      },
      include: {
        _count: {
          select: {
            tugas: true,
          },
        },
      },
    });

    return addCorsHeaders(Response.json(mataKuliah, { status: 201 }));
  } catch (error) {
    console.error("Error creating mata kuliah:", error);
    return addCorsHeaders(
      createErrorResponse("Failed to create mata kuliah", 500)
    );
  }
}

export async function OPTIONS() {
  return handleCorsOptions();
}
