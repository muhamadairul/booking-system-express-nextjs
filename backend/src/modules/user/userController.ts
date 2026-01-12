import { Request, Response, NextFunction } from "express";
import * as userService from "./userService";
import { paginatedResponse } from "../../utils/response";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const resource = await userService.createUser(req.body);
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
}

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await userService.getUsers(page, limit);

    res.json(
      paginatedResponse("Berhasil mendapatkan data!", result.items, result.meta)
    );
  } catch (err) {
    next(err);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const resource = await userService.getUserById(id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const resource = await userService.updateUser(id, req.body);
    res.json(resource);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await userService.softDeleteUser(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function restore(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const resource = await userService.restoreUser(id);
    res.json(resource);
  } catch (err) {
    next(err);
  }
}
