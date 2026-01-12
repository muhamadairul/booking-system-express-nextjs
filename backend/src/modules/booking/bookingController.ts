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
