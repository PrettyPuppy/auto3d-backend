const express = require('express');
const validate = require('../../middlewares/validate');
const kaedimController = require('../../controllers/kaedim.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/registerHook', kaedimController.registerHook);
router.get('/refreshJWT', kaedimController.refreshJWT);

router.post('/process', kaedimController.process);
router.post('/fetchRequest', kaedimController.fetchRequest);
router.post('/fetchAll', kaedimController.fetchAll);
router.post('/enhance', kaedimController.enhanceImage);

router.post('/webhook', kaedimController.webHook);

module.exports = router;
