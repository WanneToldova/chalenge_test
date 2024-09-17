const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Endpoint
router.post('/create_user', controller.create_user);
router.post('/deposit', controller.deposit);
router.post('/withdraw', controller.withdraw);
router.post('/send', controller.send);
router.get('/get_balance', controller.get_balance);

module.exports = router;
