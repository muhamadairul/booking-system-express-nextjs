import { Router } from "express";
import * as ResourceController from "./resourceController";

const router = Router();

router.post("/", ResourceController.create);
router.get("/", ResourceController.index);
router.get("/:id", ResourceController.findById);
router.put("/:id", ResourceController.update);
router.delete("/:id", ResourceController.remove);
router.post("/:id/restore", ResourceController.restore);

export default router;