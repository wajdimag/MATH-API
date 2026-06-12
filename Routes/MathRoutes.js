const express = require('express');
const router = express.Router();

const mathController = require('../controllers/mathController');

router.post('/add', mathController.add);
router.post('/subtract',mathController.subtract);
router.post('/multiply',mathController.multiply);
router.post('/divide',mathController.divide);
router.post('/power',mathController.power);
router.post('/sqrt',mathController.sqrt);
router.post('/avg',mathController.average);
router.post('/percentage', mathController.percentage);
router.get('/health', mathController.healthCheck);




module.exports = router;