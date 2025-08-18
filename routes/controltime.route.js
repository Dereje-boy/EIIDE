// routes/controlTimeRoutes.js
const express = require('express');
const router = express.Router();
const controlTimeController = require('../controllers/controltime.controller');

router.post('/', controlTimeController.createControlTime);
router.get('/', controlTimeController.getAllControlTimes);
router.get('/:id', controlTimeController.getControlTimeById);
router.get('/order/:order_id', controlTimeController.getControlTimesByOrderId);
router.put('/:id', controlTimeController.updateControlTime);
router.delete('/:id', controlTimeController.deleteControlTime);

module.exports = router;