import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { authenticateRequest, createErrorResponse } from "@/app/lib/middleware";

/**
 * @swagger
 * /api/matkul/{id}:
 *   get:
 *     summary: Get mata kuliah by ID
 *     description: Retrieve a specific mata kuliah with all its tugas
 *     tags: [Mata Kuliah]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mata kuliah ID
 *     responses:
 *       200:
 *         description: Mata kuliah details with tugas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MataKuliah'
 *       401:
 *         description: Unauthorized
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
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKeyId = await authenticateRequest(request);
  if (!apiKeyId) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const mataKuliah = await prisma.mataKuliah.findUnique({
      where: {
        id: params.id,
        apiKeyId: apiKeyId,
      },
      include: {
        tugas: {
          orderBy: {
            deadline: "asc",
          },
        },
        _count: {
          select: {
            tugas: true,
          },
        },
      },
    });

    if (!mataKuliah) {
      return createErrorResponse("Mata kuliah not found", 404);
    }

    return Response.json(mataKuliah);
  } catch (error) {
    console.error("Error fetching mata kuliah:", error);
    return createErrorResponse("Failed to fetch mata kuliah", 500);
  }
}

/**
 * @swagger
 * /api/matkul/{id}:
 *   put:
 *     summary: Update mata kuliah
 *     description: Update an existing mata kuliah
 *     tags: [Mata Kuliah]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mata kuliah ID
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
 *                 example: "Pemrograman Web Lanjut"
 *               deskripsi:
 *                 type: string
 *                 example: "Updated description"
 *               sks:
 *                 type: integer
 *                 minimum: 1
 *                 example: 4
 *     responses:
 *       200:
 *         description: Mata kuliah updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MataKuliah'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
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
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKeyId = await authenticateRequest(request);
  if (!apiKeyId) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const { nama, deskripsi, sks } = body;

    if (!nama || !sks) {
      return createErrorResponse("Name and SKS are required", 400);
    }

    if (typeof sks !== "number" || sks <= 0) {
      return createErrorResponse("SKS must be a positive number", 400);
    }

    const mataKuliah = await prisma.mataKuliah.findUnique({
      where: {
        id: params.id,
        apiKeyId: apiKeyId,
      },
    });

    if (!mataKuliah) {
      return createErrorResponse("Mata kuliah not found", 404);
    }

    const updatedMataKuliah = await prisma.mataKuliah.update({
      where: {
        id: params.id,
      },
      data: {
        nama,
        deskripsi: deskripsi || null,
        sks,
      },
      include: {
        _count: {
          select: {
            tugas: true,
          },
        },
      },
    });

    return Response.json(updatedMataKuliah);
  } catch (error) {
    console.error("Error updating mata kuliah:", error);
    return createErrorResponse("Failed to update mata kuliah", 500);
  }
}

/**
 * @swagger
 * /api/matkul/{id}:
 *   delete:
 *     summary: Delete mata kuliah
 *     description: Delete a mata kuliah and all its associated tugas
 *     tags: [Mata Kuliah]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mata kuliah ID
 *     responses:
 *       200:
 *         description: Mata kuliah deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mata kuliah deleted successfully"
 *       401:
 *         description: Unauthorized
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
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKeyId = await authenticateRequest(request);
  if (!apiKeyId) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const mataKuliah = await prisma.mataKuliah.findUnique({
      where: {
        id: params.id,
        apiKeyId: apiKeyId,
      },
    });

    if (!mataKuliah) {
      return createErrorResponse("Mata kuliah not found", 404);
    }

    await prisma.mataKuliah.delete({
      where: {
        id: params.id,
      },
    });

    return Response.json({ message: "Mata kuliah deleted successfully" });
  } catch (error) {
    console.error("Error deleting mata kuliah:", error);
    return createErrorResponse("Failed to delete mata kuliah", 500);
  }
}
