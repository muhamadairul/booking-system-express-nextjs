import { Router } from "express";
import * as ScheduleController from "./scheduleController";

const router = Router();

router.post("/resource/:resourceId", ScheduleController.create);
router.get("/resource/:resourceId", ScheduleController.findByResource);
router.get("/:id/resource/:resourceId", ScheduleController.findById);
router.put("/:id", ScheduleController.update);
router.delete("/:id/resource/:resourceId", ScheduleController.remove);

export default router;
