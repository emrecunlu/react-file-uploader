import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const create = async (data: Prisma.FileCreateInput) => {
  return prisma.file.create({ data });
};

export const remove = async (id: string) => {
  return prisma.file.delete({ where: { id } });
};

export const getAll = () => {
  return prisma.file.findMany({ orderBy: { createdAt: "desc" } });
};

export const getById = (id: string) => {
  return prisma.file.findUnique({ where: { id } });
};