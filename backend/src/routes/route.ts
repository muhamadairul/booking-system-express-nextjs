import { Router } from 'express';
import moduleRoutes from '../modules';

const router = Router();

router.use('/api', moduleRoutes);

export default router;
