import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { authenticateRequest, createErrorResponse } from "@/app/lib/middleware";

/**
 * @swagger
 * /api/tugas/{id}:
 *   get:
 *     summary: Get tugas by ID
 *     description: Retrieve a specific tugas with its mata kuliah information
 *     tags: [Tugas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tugas ID
 *     responses:
 *       200:
 *         description: Tugas details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tugas'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tugas not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKeyId = await authenticateRequest(request);
  if (!apiKeyId) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const { id } = await params;
    const tugas = await prisma.tugas.findUnique({
      where: {
        id: id,
      },
      include: {
        mataKuliah: {
          select: {
            id: true,
            nama: true,
            sks: true,
            apiKeyId: true,
          },
        },
      },
    });

    if (!tugas || tugas.mataKuliah.apiKeyId !== apiKeyId) {
      return createErrorResponse("Tugas not found", 404);
    }

    return Response.json(tugas);
  } catch (error) {
    console.error("Error fetching tugas:", error);
    return createErrorResponse("Failed to fetch tugas", 500);
  }
}

/**
 * @swagger
 * /api/tugas/{id}:
 *   put:
 *     summary: Update tugas
 *     description: Update an existing tugas
 *     tags: [Tugas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tugas ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - deadline
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Updated Tugas Name"
 *               deskripsi:
 *                 type: string
 *                 example: "Updated description"
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-25T23:59:59.000Z"
 *               status:
 *                 type: string
 *                 enum: [BELUM_DIKERJAKAN, DIKERJAKAN, SELESAI]
 *                 example: "DIKERJAKAN"
 *     responses:
 *       200:
 *         description: Tugas updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tugas'
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
 *         description: Tugas not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKeyId = await authenticateRequest(request);
  if (!apiKeyId) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { nama, deskripsi, deadline, status } = body;

    if (!nama || !deadline) {
      return createErrorResponse("Name and deadline are required", 400);
    }

    const validStatuses = ["BELUM_DIKERJAKAN", "DIKERJAKAN", "SELESAI"];
    if (status && !validStatuses.includes(status)) {
      return createErrorResponse("Invalid status", 400);
    }

    // Verify tugas belongs to the API key
    const existingTugas = await prisma.tugas.findUnique({
      where: {
        id: id,
      },
      include: {
        mataKuliah: {
          select: {
            apiKeyId: true,
          },
        },
      },
    });

    if (!existingTugas || existingTugas.mataKuliah.apiKeyId !== apiKeyId) {
      return createErrorResponse("Tugas not found", 404);
    }

    const updatedTugas = await prisma.tugas.update({
      where: {
        id: id,
      },
      data: {
        nama,
        deskripsi: deskripsi || null,
        deadline: new Date(deadline),
        status: status || existingTugas.status,
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

    return Response.json(updatedTugas);
  } catch (error) {
    console.error("Error updating tugas:", error);
    return createErrorResponse("Failed to update tugas", 500);
  }
}

/**
 * @swagger
 * /api/tugas/{id}:
 *   delete:
 *     summary: Delete tugas
 *     description: Delete a specific tugas
 *     tags: [Tugas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tugas ID
 *     responses:
 *       200:
 *         description: Tugas deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tugas deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tugas not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKeyId = await authenticateRequest(request);
  if (!apiKeyId) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const { id } = await params;
    // Verify tugas belongs to the API key
    const existingTugas = await prisma.tugas.findUnique({
      where: {
        id: id,
      },
      include: {
        mataKuliah: {
          select: {
            apiKeyId: true,
          },
        },
      },
    });

    if (!existingTugas || existingTugas.mataKuliah.apiKeyId !== apiKeyId) {
      return createErrorResponse("Tugas not found", 404);
    }

    await prisma.tugas.delete({
      where: {
        id: id,
      },
    });

    return Response.json({ message: "Tugas deleted successfully" });
  } catch (error) {
    console.error("Error deleting tugas:", error);
    return createErrorResponse("Failed to delete tugas", 500);
  }
}
