import { Router } from 'express';
import bookingRoutes from './booking/bookingRoute';
import resourceRoutes from './resource/resourceRoute';
import scheduleRoutes from './schedule/scheduleRoute';
import userRoutes from './user/userRoute';
import roleRoutes from './role/roleRoute';
import { authMiddleware } from '../middleware/auth.middleware';
import { authLogin, authLogout, me } from './auth/authController';

const router = Router();

router.use('/login', authLogin);

router.use(authMiddleware);
router.use('/logout', authLogout);
router.use('/bookings', bookingRoutes);
router.use('/resources', resourceRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/users', userRoutes);
router.use('/me', me);
router.use('/roles', roleRoutes);
export default router;
