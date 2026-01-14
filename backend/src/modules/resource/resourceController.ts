import { Request, Response, NextFunction } from "express";
import * as ResourceService from "./resourceService";
import { paginatedResponse } from "../../utils/response";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const resource = await ResourceService.createResource(req.body);
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
}

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await ResourceService.getResources(page, limit);

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
    const resource = await ResourceService.getResourceById(id);

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
    const resource = await ResourceService.updateResource(id, req.body);
    res.json(resource);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await ResourceService.softDeleteResource(id);
    res.status(200).send();
  } catch (err) {
    next(err);
  }
}

export async function restore(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const resource = await ResourceService.restoreResource(id);
    res.json(resource);
  } catch (err) {
    next(err);
  }
}
