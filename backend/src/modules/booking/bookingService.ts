import { prisma } from "../../config/prisma";

interface CreateBookingDTO {
  customerId: number;
  scheduleId: number;
  quantity?: number;
}

export async function createBooking(data: CreateBookingDTO) {
  const quantity = data.quantity ?? 1;

  return prisma.$transaction(async (tx) => {
    // 1. Ambil schedule + resource
    const schedule = await tx.schedule.findFirst({
      where: {
        id: data.scheduleId,
        deletedAt: null,
      },
      include: {
        resource: true,
      },
    });

    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const capacity = schedule.resource.capacity;

    // Kalau resource ga punya capacity, anggap unlimited
    if (capacity !== null) {
      // 2. Hitung total booking CONFIRMED
      const totalBooked = await tx.booking.aggregate({
        where: {
          scheduleId: schedule.id,
          status: "CONFIRMED",
          deletedAt: null,
        },
        _sum: {
          quantity: true,
        },
      });

      const bookedQty = totalBooked._sum.quantity ?? 0;
      const available = capacity - bookedQty;

      if (quantity > available) {
        throw new Error("Not enough capacity available");
      }
    }

    // 3. Simpan booking
    return tx.booking.create({
      data: {
        customerId: data.customerId,
        scheduleId: data.scheduleId,
        quantity,
        status: "CONFIRMED",
      },
    });
  });
}
