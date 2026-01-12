import { Router } from "express";
import * as ScheduleController from "./scheduleController";

const router = Router();

router.post("/", ScheduleController.create);
router.get("/resource/:resourceId", ScheduleController.findByResource);
router.get("/:id", ScheduleController.findById);
router.put("/:id", ScheduleController.update);
router.delete("/:id", ScheduleController.remove);

export default router;
