import { UserStatus } from "@prisma/client";
import { createHash } from "crypto";
import { prisma } from "../../config/prisma";

export interface CreateRoleDTO {
  name: string;
}

export interface UpdateRoleDTO {
  name: string;
}

export async function createRole(data: CreateRoleDTO) {
  const slug = data.name.toLowerCase().replace(/\s+/g, "-");
  const role = await prisma.role.findUnique({ where: { slug } });
  if (role) {
    throw new Error("Role already exists");
  }

  return prisma.role.create({
    data: {
      ...data,
      slug,
    },
  });
}

export async function getRoles(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [items, total] = await prisma.$transaction([
    prisma.role.findMany({
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

export async function getRoleById(id: number) {
  return prisma.role.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}

export async function updateRole(id: number, data: UpdateRoleDTO) {
  return prisma.role.update({
    where: {
      id,
      deletedAt: null,
    },
    data,
  });
}

export async function softDeleteRole(id: number) {
  return prisma.role.update({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function restoreRole(id: number) {
  return prisma.role.update({
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
