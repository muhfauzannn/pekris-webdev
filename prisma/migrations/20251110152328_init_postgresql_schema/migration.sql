-- CreateEnum
CREATE TYPE "StatusTugas" AS ENUM ('BELUM_DIKERJAKAN', 'DIKERJAKAN', 'SELESAI');

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mata_kuliah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "sks" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "apiKeyId" TEXT NOT NULL,

    CONSTRAINT "mata_kuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tugas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "status" "StatusTugas" NOT NULL DEFAULT 'BELUM_DIKERJAKAN',
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mataKuliahId" TEXT NOT NULL,

    CONSTRAINT "tugas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- AddForeignKey
ALTER TABLE "mata_kuliah" ADD CONSTRAINT "mata_kuliah_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tugas" ADD CONSTRAINT "tugas_mataKuliahId_fkey" FOREIGN KEY ("mataKuliahId") REFERENCES "mata_kuliah"("id") ON DELETE CASCADE ON UPDATE CASCADE;
