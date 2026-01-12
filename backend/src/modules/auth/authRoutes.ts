import { Router } from "express";
import * as authController from "./authController";

const router = Router();

router.post("/login", authController.authLogin);

export default router;