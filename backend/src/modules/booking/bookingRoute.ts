import { Router } from 'express';
import * as controller from './bookingController';

const router = Router();

router.post('/', controller.create);
// router.get('/', controller.getBookings);

export default router;
