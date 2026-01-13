import { UserStatus } from "@prisma/client";
import { createHash } from "crypto";
import { prisma } from "../../config/prisma";

export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
  roleId: number;
  status?: UserStatus;
}

export interface UpdateResourceDTO {
  email?: string;
  username?: string;
  roleId?: number;
  status?: UserStatus;
}

export async function createUser(data: CreateUserDTO) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (user) {
    throw new Error("Email already exists");
  }

  const username = await prisma.user.findFirst({ where: { username: data.username } });
  
  if (username) {
    throw new Error("Username already exists");
  }

  const hashedPassword = createHash("sha256").update(data.password).digest("hex");
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
}

export async function getUsers(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
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

export async function getUserById(id: number) {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}

export async function updateUser(id: number, data: UpdateResourceDTO) {
  return prisma.user.update({
    where: {
      id,
      deletedAt: null,
    },
    data,
  });
}

export async function softDeleteUser(id: number) {
  return prisma.user.update({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function restoreUser(id: number) {
  return prisma.user.update({
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
