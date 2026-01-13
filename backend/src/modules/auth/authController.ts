import { login } from "./authService";
import { successResponse } from "../../utils/response";
import { prisma } from "../../config/prisma";

export async function authLogin(req: any, res: any, next: any) {
  try {
    const { email, password } = req.body;

    const result = await login(email, password);

    res.json(
      successResponse("Login berhasil", {
        accessToken: result.data.token,
        user: result.data.user,
      })
    );
  } catch (e) {
    next(e);
  }
}

export async function authLogout(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      await prisma.userAccessToken.delete({
        where: { token },
      });
    }

    res.json(successResponse("Logout berhasil"));
  } catch (e) {
    next(e);
  }
}

export function me(req: any, res: any) {
  res.json(
    successResponse("Berhasil mendapatkan data", {
      user: req.user,
    })
  );
}
