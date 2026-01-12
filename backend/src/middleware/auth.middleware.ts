import { prisma } from "../config/prisma";

export async function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const accessToken = await prisma.userAccessToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!accessToken) {
    return res.status(401).json({ message: "Token tidak valid" });
  }

  if (accessToken.expiredAt && accessToken.expiredAt < new Date()) {
    return res.status(401).json({ message: "Token kadaluarsa" });
  }

  // inject user ke request
  req.user = accessToken.user;
  req.token = token;

  // update last used
  await prisma.userAccessToken.update({
    where: { id: accessToken.id },
    data: { lastUsedAt: new Date() },
  });

  next();
}
