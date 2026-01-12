import { Request, Response, NextFunction } from "express";
import * as ResourceService from "./resourceService";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const resource = await ResourceService.createResource(req.body);
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
}

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const resources = await ResourceService.getResources();
    res.json(resources);
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
    res.status(204).send();
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