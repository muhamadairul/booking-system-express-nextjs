import { Router } from "express";
import * as RoleController from "./roleController";

const router = Router();

router.post("/", RoleController.create);
router.get("/", RoleController.index);
router.get("/:id", RoleController.findById);
router.put("/:id", RoleController.update);
router.delete("/:id", RoleController.remove);
router.post("/:id/restore", RoleController.restore);

export default router;