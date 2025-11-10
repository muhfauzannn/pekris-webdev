import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { authenticateRequest, createErrorResponse } from "@/app/lib/middleware";

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get statistics
 *     description: Get summary statistics for the authenticated API key
 *     tags: [System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mataKuliah:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of mata kuliah
 *                     totalSks:
 *                       type: integer
 *                       description: Total SKS from all mata kuliah
 *                 tugas:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of tugas
 *                     belumDikerjakan:
 *                       type: integer
 *                       description: Number of pending tugas
 *                     dikerjakan:
 *                       type: integer
 *                       description: Number of in-progress tugas
 *                     selesai:
 *                       type: integer
 *                       description: Number of completed tugas
 *                     overdue:
 *                       type: integer
 *                       description: Number of overdue tugas
 *                 deadlines:
 *                   type: object
 *                   properties:
 *                     upcoming:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           tugasId:
 *                             type: string
 *                           nama:
 *                             type: string
 *                           deadline:
 *                             type: string
 *                             format: date-time
 *                           mataKuliah:
 *                             type: string
 *       401:
 *         description: Unauthorized
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
    // Get mata kuliah stats
    const mataKuliahStats = await prisma.mataKuliah.aggregate({
      where: { apiKeyId },
      _count: { id: true },
      _sum: { sks: true },
    });

    // Get tugas stats by status
    const tugasStats = await prisma.tugas.groupBy({
      by: ["status"],
      where: {
        mataKuliah: { apiKeyId },
      },
      _count: { id: true },
    });

    // Get overdue tugas
    const overdueTugas = await prisma.tugas.count({
      where: {
        mataKuliah: { apiKeyId },
        deadline: { lt: new Date() },
        status: { not: "SELESAI" },
      },
    });

    // Get upcoming deadlines (next 7 days)
    const upcomingDeadlines = await prisma.tugas.findMany({
      where: {
        mataKuliah: { apiKeyId },
        deadline: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        status: { not: "SELESAI" },
      },
      select: {
        id: true,
        nama: true,
        deadline: true,
        mataKuliah: {
          select: { nama: true },
        },
      },
      orderBy: { deadline: "asc" },
      take: 5,
    });

    type UpcomingTugas = {
      id: string;
      nama: string;
      deadline: Date;
      mataKuliah: { nama: string };
    };

    // Process tugas stats
    const tugasStatusCounts = {
      total: 0,
      belumDikerjakan: 0,
      dikerjakan: 0,
      selesai: 0,
    };

    tugasStats.forEach((stat: { status: string; _count: { id: number } }) => {
      tugasStatusCounts.total += stat._count.id;
      if (stat.status === "BELUM_DIKERJAKAN") {
        tugasStatusCounts.belumDikerjakan = stat._count.id;
      } else if (stat.status === "DIKERJAKAN") {
        tugasStatusCounts.dikerjakan = stat._count.id;
      } else if (stat.status === "SELESAI") {
        tugasStatusCounts.selesai = stat._count.id;
      }
    });

    const stats = {
      mataKuliah: {
        total: mataKuliahStats._count.id || 0,
        totalSks: mataKuliahStats._sum.sks || 0,
      },
      tugas: {
        ...tugasStatusCounts,
        overdue: overdueTugas,
      },
      deadlines: {
        upcoming: upcomingDeadlines.map((tugas: UpcomingTugas) => ({
          tugasId: tugas.id,
          nama: tugas.nama,
          deadline: tugas.deadline,
          mataKuliah: tugas.mataKuliah.nama,
        })),
      },
    };

    return Response.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return createErrorResponse("Failed to fetch statistics", 500);
  }
}
