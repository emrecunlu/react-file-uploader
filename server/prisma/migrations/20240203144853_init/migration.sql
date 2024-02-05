-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "path" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "size" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
