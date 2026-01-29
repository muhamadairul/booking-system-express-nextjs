import { BookingMode } from "@prisma/client";
import { prisma } from "../../config/prisma";


export interface CreateResourceDTO {
  name: string;
  type: string;
  capacity?: number;
  description?: string;
  bookingMode: BookingMode;
}

export interface UpdateResourceDTO {
  name?: string;
  type?: string;
  capacity?: number;
  description?: string;
  bookingMode?: BookingMode;
}

export async function createResource(data: CreateResourceDTO) {
  const capacity = Number(data.capacity) || 0;
  return prisma.resource.create({
    data: {
      ...data,
      capacity,
    },
  });
}

export async function getResources(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [items, total] = await prisma.$transaction([
    prisma.resource.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.resource.count({
      where: { deletedAt: null },
    }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      totalItems: total,
    },
  };
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
  const updateData: any = {};

  updateData.name = data.name;
  updateData.type = data.type;
  updateData.capacity = data.capacity ? Number(data.capacity) : 0;

  if (data.bookingMode !== undefined || data.bookingMode !== null || data.bookingMode !== "null") {
    updateData.bookingMode = data.bookingMode;
  }

  if (data.description !== undefined || data.description !== null || data.description !== "null") {
    updateData.description = data.description;
  }

  return prisma.resource.update({
    where: {
      id,
      deletedAt: null,
    },
    data: updateData,
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
