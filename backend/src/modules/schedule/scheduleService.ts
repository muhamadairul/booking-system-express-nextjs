import { BookingMode, WeekDay } from "@prisma/client";
import { prisma } from "../../config/prisma";

interface UpdateScheduleDTO {
  mode: BookingMode;

  // FLEXIBLE
  openTime?: string;
  closeTime?: string;
  pricePerHour?: bigint;

  // FIXED_SLOT
  startTime?: string;
  endTime?: string;
  price?: bigint;
}

interface CreateScheduleDTO {
  resourceId: number;
  mode: BookingMode;
  day: any;

  // FLEXIBLE
  openTime?: string;
  closeTime?: string;
  pricePerHour?: bigint;

  // FIXED_SLOT
  slots?: {
    startTime: string;
    endTime?: string;
    price?: bigint;
  }[];
}

export async function createSchedule(data: CreateScheduleDTO) {
  const resource = await prisma.resource.findUnique({
    where: { id: data.resourceId },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (resource.bookingMode !== data.mode) {
    throw new Error("Booking mode mismatch with resource");
  }

  if (data.mode === "FLEXIBLE") {
    if (!data.openTime || !data.closeTime) {
      throw new Error("Open & close time required");
    }

    const conflict = await isWeeklyScheduleOverlapping(
      data.resourceId,
      data.day,
      data.openTime,
      data.closeTime,
    );

    if (conflict) {
      throw new Error("Weekly schedule overlap detected");
    }

    return prisma.weeklySchedule.create({
      data: {
        resourceId: data.resourceId,
        day: data.day,
        openTime: data.openTime,
        closeTime: data.closeTime,
        pricePerHour: data.pricePerHour,
      },
    });
  }

  if (data.mode === "FIXED_SLOT") {
    if (!data.slots || data.slots.length === 0) {
      throw new Error("Slots are required");
    }

    const created = [];

    for (const slot of data.slots) {
      const conflict = await isTimeSlotOverlapping(
        data.resourceId,
        data.day,
        data.slots[0].startTime,
        data.slots[0].endTime,
      );

      if (conflict) {
        throw new Error("Time slot overlap detected");
      }
      created.push(
        await prisma.timeSlot.create({
          data: {
            resourceId: data.resourceId,
            day: data.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: slot.price,
          },
        }),
      );
    }

    return created;
  }

  throw new Error("Unsupported booking mode");
}

export async function getSchedulesByResource(resourceId: number) {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (resource.bookingMode === "FLEXIBLE") {
    return prisma.weeklySchedule.findMany({
      where: {
        resourceId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (resource.bookingMode === "FIXED_SLOT")
    return prisma.timeSlot.findMany({
      where: {
        resourceId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });
}

export async function getScheduleById(id: number, resourceId: number) {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (resource.bookingMode === "FLEXIBLE")
    return prisma.weeklySchedule.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

  if (resource.bookingMode === "FIXED_SLOT")
    return prisma.timeSlot.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
}

export async function updateSchedule(id: number, data: UpdateScheduleDTO) {
  if (data.mode === "FLEXIBLE") {
    const existing = await prisma.weeklySchedule.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new Error("Not found");

    const openTime = data.openTime ?? existing.openTime;
    const closeTime = data.closeTime ?? existing.closeTime;

    const conflict = await isWeeklyScheduleOverlapping(
      existing.resourceId,
      existing.day,
      openTime,
      closeTime,
      id,
    );

    if (conflict) {
      throw new Error("Weekly schedule overlap detected");
    }

    return prisma.weeklySchedule.update({
      where: { id },
      data: {
        openTime,
        closeTime,
        pricePerHour: data.pricePerHour ?? existing.pricePerHour,
      },
    });
  }

  if (data.mode === "FIXED_SLOT") {
    const existing = await prisma.timeSlot.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new Error("Not found");

    const startTime = data.startTime ?? existing.startTime;
    const endTime = data.endTime ?? existing.endTime ?? undefined;

    const conflict = await isTimeSlotOverlapping(
      existing.resourceId,
      existing.day,
      startTime,
      endTime,
      id,
    );

    if (conflict) {
      throw new Error("Time slot overlap detected");
    }

    return prisma.timeSlot.update({
      where: { id },
      data: {
        startTime,
        endTime,
        price: data.price ?? existing.price,
      },
    });
  }

  throw new Error("Invalid booking mode");
}

export async function softDeleteSchedule(id: number, resourceId: number) {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  if (resource.bookingMode === "FLEXIBLE")
    return prisma.weeklySchedule.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

  if (resource.bookingMode === "FIXED_SLOT")
    return prisma.timeSlot.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
}

async function isWeeklyScheduleOverlapping(
  resourceId: number,
  day: WeekDay,
  openTime: string,
  closeTime: string,
  excludeId?: number,
) {
  return prisma.weeklySchedule.findFirst({
    where: {
      resourceId,
      day,
      deletedAt: null,
      ...(excludeId && { id: { not: excludeId } }),
      openTime: { lt: closeTime },
      closeTime: { gt: openTime },
    },
  });
}

async function isTimeSlotOverlapping(
  resourceId: number,
  day: WeekDay,
  startTime: string,
  endTime?: string,
  excludeId?: number,
) {
  return prisma.timeSlot.findFirst({
    where: {
      resourceId,
      day,
      deletedAt: null,
      ...(excludeId && { id: { not: excludeId } }),
      startTime: { lt: endTime ?? startTime },
      ...(endTime && {
        endTime: { gt: startTime },
      }),
    },
  });
}
