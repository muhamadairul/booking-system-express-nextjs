import { prisma } from "../../config/prisma";

export interface CreateResourceDTO {
  name: string;
  type: string;
  capacity?: number;
  description?: string;
}

export interface UpdateResourceDTO {
  name?: string;
  type?: string;
  capacity?: number;
  description?: string;
}

export async function createResource(data: CreateResourceDTO) {
  return prisma.resource.create({
    data,
  });
}

export async function getResources() {
  return prisma.resource.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getResourceById(id: number) {
  return prisma.resource.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}

export async function updateResource(id: number, data: UpdateResourceDTO) {
  return prisma.resource.update({
    where: {
      id,
      deletedAt: null,
    },
    data,
  });
}

export async function softDeleteResource(id: number) {
  return prisma.resource.update({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function restoreResource(id: number) {
  return prisma.resource.update({
    where: {
      id,
      deletedAt: {
        not: null,
      },
    },
    data: {
      deletedAt: null,
    },
  });
}
