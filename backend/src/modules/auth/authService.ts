import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../../config/prisma";
import { generateToken } from "../../utils/token";

export async function login(identifier: string, password: string, agent?: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
      deletedAt: null,
      status: "ACTIVE",
    },
  });

  if (!user) {
    throw new Error("Email/Username atau password salah");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Email/Username atau password salah");
  }

  const token = generateToken();

  await prisma.userAccessToken.create({
    data: {
      userId: user.id,
      token,
      // agent,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 hari
    },
  });

  return {
    message: "Login berhasil",
    data: {
      token,
      tokenType: "Bearer",
      user,
    },
  };
}

export async function logout(req: any, res: any) {
  await prisma.userAccessToken.delete({
    where: { token: req.token },
  });

  return res.json({
    message: "Logout berhasil",
  });
}
