import { Router } from 'express';
import * as controller from './bookingController';

const router = Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.put('/:id/confirm', controller.confirm);
router.put('/:id/cancel', controller.cancel);
// router.get('/', controller.getBookings);

export default router;
