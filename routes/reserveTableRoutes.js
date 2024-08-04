const express = require('express');
const router = express.Router();
const reservationControllers = require('../controllers/reservationControllers');
const { verifyToken } = require('../middlewares/verifyToken');
const { authenticated } = require('../middlewares/authenticated');

router.get(
  '/',
  verifyToken,
  authenticated,
  reservationControllers.showAllReservations
);

router.get(
  '/singleReserve',
  verifyToken,
  reservationControllers.getReservationsByUserId
);

router.post('/:tableId', verifyToken, reservationControllers.reserveTable);

router.patch(
  '/:targetReserve',
  verifyToken,
  reservationControllers.updateReservationStatus
);

router.delete(
  '/:reservationId',
  verifyToken,
  reservationControllers.deleteReservation
);

module.exports = router;
