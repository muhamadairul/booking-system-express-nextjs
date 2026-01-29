import { Request, Response, NextFunction } from "express";
import * as ScheduleService from "./scheduleService";
import { serializeBigInt } from "../../utils/serialize";
import { successResponse } from "../../utils/response";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.resourceId);
    console.log(id);
    const schedule = await ScheduleService.createSchedule(id, req.body);
    res.status(201).json(successResponse("Schedule created", schedule));
  } catch (err) {
    next(err);
  }
}

export async function findByResource(req: Request, res: Response, next: NextFunction) {
  try {
    const resourceId = Number(req.params.resourceId);
    const schedules = await ScheduleService.getSchedulesByResource(resourceId);
    res.json(successResponse("Berhasil mendapatkan data!", schedules));
  } catch (err) {
    next(err);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const resourceId = Number(req.params.resourceId);
    const schedule = await ScheduleService.getScheduleById(id, resourceId);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json(successResponse("Berhasil mendapatkan data!", schedule));
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const schedule = await ScheduleService.updateSchedule(id, req.body);
    res.json(successResponse("Berhasil mengupdate data!", schedule));
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const resourceId = Number(req.params.resourceId);
    await ScheduleService.softDeleteSchedule(id, resourceId);
    res.json({ message: "Schedule deleted" }).status(200).send();
  } catch (err) {
    next(err);
  }
}
