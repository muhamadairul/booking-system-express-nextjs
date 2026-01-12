import { Router } from "express";
import * as UserController from "./userController";

const router = Router();

router.post("/", UserController.create);
router.get("/", UserController.index);
router.get("/:id", UserController.findById);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.remove);
router.post("/:id/restore", UserController.restore);

export default router;