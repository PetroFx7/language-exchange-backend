const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticate } = require('../middleware/authenticate');

router.post('/', authenticate, requestController.createRequest);
router.get('/incoming', authenticate, requestController.getIncomingRequests);
router.get('/outgoing', authenticate, requestController.getOutgoingRequests);
router.put('/:id/accept', authenticate, requestController.acceptRequest);
router.put('/:id/decline', authenticate, requestController.declineRequest);
router.get('/matches', authenticate, requestController.getMatches);

module.exports = router;