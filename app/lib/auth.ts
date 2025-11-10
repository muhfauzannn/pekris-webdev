import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function generateApiKey(): Promise<string> {
  const key = generateRandomKey();
  const hashedKey = await bcrypt.hash(key, 10);
  return hashedKey;
}

export async function generateRawApiKey(): Promise<string> {
  return generateRandomKey();
}

export async function validateApiKey(key: string): Promise<string | null> {
  try {
    const apiKeys = await prisma.apiKey.findMany();

    for (const apiKey of apiKeys) {
      const isValid = await bcrypt.compare(key, apiKey.key);
      if (isValid) {
        return apiKey.id;
      }
    }

    return null;
  } catch (error) {
    console.error("Error validating API key:", error);
    return null;
  }
}

function generateRandomKey(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
