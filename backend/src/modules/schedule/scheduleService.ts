import { prisma } from "../../config/prisma";

interface CreateScheduleDTO {
  resourceId: number;
  startTime: Date;
  endTime: Date;
  price?: bigint;
}

interface UpdateScheduleDTO {
  startTime?: Date;
  endTime?: Date;
  price?: bigint;
}

export async function createSchedule(data: CreateScheduleDTO) {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (startTime >= endTime) {
    throw new Error("Start time must be before end time");
  }

  const conflict = await isScheduleOverlapping(data.resourceId, startTime, endTime);

  if (conflict) {
    throw new Error("Schedule time is overlapping with existing schedule");
  }

  return prisma.schedule.create({
    data: {
      ...data,
      startTime,
      endTime,
    },
  });
}

export async function getSchedulesByResource(resourceId: number) {
  return prisma.schedule.findMany({
    where: {
      resourceId,
      deletedAt: null,
    },
    orderBy: {
      startTime: "asc",
    },
  });
}

export async function getScheduleById(id: number) {
  return prisma.schedule.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}

export async function updateSchedule(id: number, data: UpdateScheduleDTO) {
  const existing = await prisma.schedule.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!existing) {
    throw new Error("Schedule not found");
  }

  const startTime = data.startTime ? new Date(data.startTime) : existing.startTime;

  const endTime = data.endTime ? new Date(data.endTime) : existing.endTime;

  const conflict = await isScheduleOverlapping(
    existing.resourceId,
    startTime,
    endTime,
    id
  );

  if (conflict) {
    throw new Error("Schedule time is overlapping with existing schedule");
  }

  return prisma.schedule.update({
    where: { id },
    data,
  });
}

export async function softDeleteSchedule(id: number) {
  return prisma.schedule.update({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

async function isScheduleOverlapping(
  resourceId: number,
  startTime: Date,
  endTime: Date,
  excludeScheduleId?: number
) {
  return prisma.schedule.findFirst({
    where: {
      resourceId,
      deletedAt: null,
      ...(excludeScheduleId && {
        id: { not: excludeScheduleId },
      }),
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
    },
  });
}
