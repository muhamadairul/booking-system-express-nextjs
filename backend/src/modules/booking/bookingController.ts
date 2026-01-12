import { Request, Response, NextFunction } from "express";
import * as BookingService from "./bookingService";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await BookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

export async function confirm(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const booking = await BookingService.confirmBooking(id);
    res.json(booking);
  } catch (e) {
    next(e);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await BookingService.cancelBooking(id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

