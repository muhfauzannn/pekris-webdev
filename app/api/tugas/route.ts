import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { authenticateRequest, createErrorResponse } from "@/app/lib/middleware";

/**
 * @swagger
 * /api/tugas:
 *   get:
 *     summary: Get all tugas
 *     description: Retrieve all tugas associated with the authenticated API key, with optional filtering
 *     tags: [Tugas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: mataKuliahId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter tugas by mata kuliah ID
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [BELUM_DIKERJAKAN, DIKERJAKAN, SELESAI]
 *         description: Filter tugas by status
 *     responses:
 *       200:
 *         description: List of tugas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tugas'
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
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const mataKuliahId = searchParams.get("mataKuliahId");
    const statusParam = searchParams.get("status");

    // Validate status parameter
    const validStatuses = ["BELUM_DIKERJAKAN", "DIKERJAKAN", "SELESAI"];
    const status =
      statusParam && validStatuses.includes(statusParam)
        ? (statusParam as "BELUM_DIKERJAKAN" | "DIKERJAKAN" | "SELESAI")
        : undefined;

    const whereClause = {
      mataKuliah: {
        apiKeyId: apiKeyId,
      },
      ...(mataKuliahId && { mataKuliahId }),
      ...(status && { status }),
    };

    const tugas = await prisma.tugas.findMany({
      where: whereClause,
      include: {
        mataKuliah: {
          select: {
            id: true,
            nama: true,
            sks: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    return Response.json(tugas);
  } catch (error) {
    console.error("Error fetching tugas:", error);
    return createErrorResponse("Failed to fetch tugas", 500);
  }
}

/**
 * @swagger
 * /api/tugas:
 *   post:
 *     summary: Create new tugas
 *     description: Create a new tugas associated with a mata kuliah
 *     tags: [Tugas]
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
 *               - mataKuliahId
 *               - deadline
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Name of the tugas
 *                 example: "Tugas 1"
 *               deskripsi:
 *                 type: string
 *                 description: Description of the tugas
 *                 example: "Membuat website responsif"
 *               mataKuliahId:
 *                 type: string
 *                 description: ID of the mata kuliah this tugas belongs to
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: Deadline for the tugas
 *                 example: "2023-12-20T23:59:59.000Z"
 *               status:
 *                 type: string
 *                 enum: [BELUM_DIKERJAKAN, DIKERJAKAN, SELESAI]
 *                 description: Status of the tugas
 *                 default: BELUM_DIKERJAKAN
 *     responses:
 *       201:
 *         description: Tugas created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tugas'
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
 *       404:
 *         description: Mata kuliah not found
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
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const { nama, deskripsi, mataKuliahId, deadline, status } = body;

    if (!nama || !mataKuliahId || !deadline) {
      return createErrorResponse(
        "Name, mata kuliah ID, and deadline are required",
        400
      );
    }

    // Verify mata kuliah belongs to the API key
    const mataKuliah = await prisma.mataKuliah.findUnique({
      where: {
        id: mataKuliahId,
        apiKeyId: apiKeyId,
      },
    });

    if (!mataKuliah) {
      return createErrorResponse("Mata kuliah not found", 404);
    }

    const validStatuses = ["BELUM_DIKERJAKAN", "DIKERJAKAN", "SELESAI"];
    if (status && !validStatuses.includes(status)) {
      return createErrorResponse("Invalid status", 400);
    }

    const tugas = await prisma.tugas.create({
      data: {
        nama,
        deskripsi: deskripsi || null,
        mataKuliahId,
        deadline: new Date(deadline),
        status: status || "BELUM_DIKERJAKAN",
      },
      include: {
        mataKuliah: {
          select: {
            id: true,
            nama: true,
            sks: true,
          },
        },
      },
    });

    return Response.json(tugas, { status: 201 });
  } catch (error) {
    console.error("Error creating tugas:", error);
    return createErrorResponse("Failed to create tugas", 500);
  }
}
