import { Request, Response, NextFunction } from "express";
import * as ScheduleService from "./scheduleService";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const schedule = await ScheduleService.createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (err) {
    next(err);
  }
}

export async function findByResource(req: Request, res: Response, next: NextFunction) {
  try {
    const resourceId = Number(req.params.resourceId);
    const schedules = await ScheduleService.getSchedulesByResource(resourceId);
    res.json(schedules);
  } catch (err) {
    next(err);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const schedule = await ScheduleService.getScheduleById(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json(schedule);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const schedule = await ScheduleService.updateSchedule(id, req.body);
    res.json(schedule);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await ScheduleService.softDeleteSchedule(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
