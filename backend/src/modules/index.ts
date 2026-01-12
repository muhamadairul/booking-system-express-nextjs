import { Router } from 'express';
import bookingRoutes from './booking/bookingRoute';
import resourceRoutes from './resource/resourceRoute';
import scheduleRoutes from './schedule/scheduleRoute';

const router = Router();

// satu tempat buat daftar module
router.use('/bookings', bookingRoutes);
router.use('/resources', resourceRoutes);
router.use('/schedules', scheduleRoutes);

export default router;
