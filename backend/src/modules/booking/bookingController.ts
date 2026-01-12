import { Request, Response, NextFunction } from "express";
import * as BookingService from "./bookingService";
import { paginatedResponse } from "../../utils/response";

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await BookingService.getBookings(page, limit);

    res.json(paginatedResponse("Berhasil mendapatkan data!", result.items, result.meta));
  } catch (err) {
    next(err);
  }
}

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
