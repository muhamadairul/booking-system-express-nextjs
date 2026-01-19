import { prisma } from "../../config/prisma";

interface CreateBookingDTO {
  customerId: number;
  scheduleId: number;
  quantity?: number;
}

export async function getBookings(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [items, total] = await prisma.$transaction([
    prisma.booking.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      include: { customer: true, schedule: { include: { resource: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.count({
      where: { deletedAt: null },
    }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      totalItems: total,
    },
  };
}

export async function createBooking(data: CreateBookingDTO) {
  const quantity = data.quantity ?? 1;

  return prisma.$transaction(async (tx) => {
    const schedule = await tx.schedule.findFirst({
      where: {
        id: data.scheduleId,
        deletedAt: null,
      },
      include: { resource: true },
    });

    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const capacity = schedule.resource.capacity ?? 0;

    const bookedQty = await tx.booking.aggregate({
      where: {
        scheduleId: schedule.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        deletedAt: null,
      },
      _sum: { quantity: true },
    });

    const used = bookedQty._sum.quantity ?? 0;

    if (used + quantity > capacity) {
      throw new Error("Schedule is fully booked");
    }

    return tx.booking.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });
  });
}

export async function confirmBooking(id: number) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: { id, deletedAt: null },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "PENDING") {
      throw new Error("Only PENDING booking can be confirmed");
    }

    return tx.booking.update({
      where: { id },
      data: { status: "CONFIRMED" },
    });
  });
}

export async function cancelBooking(id: number) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: { id, deletedAt: null },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "CANCELED") {
      throw new Error("Booking already canceled");
    }

    return tx.booking.update({
      where: { id },
      data: {
        status: "CANCELED",
        deletedAt: new Date(),
      },
    });
  });
}
