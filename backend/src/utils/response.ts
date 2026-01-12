import { serializeBigInt } from "./serialize";

export function successResponse(message: string, data: any = null) {
  return {
    message,
    data: data ? serializeBigInt(data) : null,
  };
}

export function paginatedResponse(
  message: string,
  data: any[],
  meta: {
    page: number;
    limit: number;
    totalItems: number;
  }
) {
  const totalPages = Math.ceil(meta.totalItems / meta.limit);

  return {
    message,
    data: serializeBigInt(data),
    meta: {
      page: meta.page,
      limit: meta.limit,
      totalItems: meta.totalItems,
      totalPages,
      hasNext: meta.page < totalPages,
      hasPrev: meta.page > 1,
    },
  };
}

export function errorResponse(message: string, status = 400) {
  return {
    message,
    data: null,
    status,
  };
}
