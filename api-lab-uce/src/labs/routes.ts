import { Router } from 'express';
import { getAvailability, createBooking, listLabs, getUserReservations, cancelReservation, getAllReservations, rescheduleReservation } from './controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Lab availability & booking
router.get('/', listLabs);
router.get('/disponibilidad', authenticateToken, getAvailability);
router.post('/reservar', authenticateToken, createBooking);

router.get('/mis-reservas', authenticateToken, getUserReservations);
router.get('/todas-reservas', authenticateToken, getAllReservations);
router.delete('/reservas/:id', authenticateToken, cancelReservation);
router.patch('/reservas/:id/reagendar', authenticateToken, rescheduleReservation);

export default router;
