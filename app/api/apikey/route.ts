import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { generateRawApiKey } from "@/app/lib/auth";
import bcrypt from "bcryptjs";

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
