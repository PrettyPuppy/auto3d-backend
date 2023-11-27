const express = require('express');
const validate = require('../../middlewares/validate');
const kaedimController = require('../../controllers/kaedim.controller');
const auth = require('../../middlewares/auth');
const multer = require("multer");

const router = express.Router();

router.get('/registerHook', kaedimController.registerHook);
router.get('/refreshJWT', kaedimController.refreshJWT);

router.post('/process', kaedimController.process);
router.post('/fetchRequest', kaedimController.fetchRequest);
router.post('/fetchAll', kaedimController.fetchAll);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "static/"); // This is where the uploaded files will be stored
    },
    filename: function (req, file, cb) {
        // You can define how the file should be named here (e.g., use a timestamp)
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

router.post('/enhance', upload.fields([{ name: "frontImage" } , { name: "backImage" }]), kaedimController.enhanceImage);

router.post('/webhook', kaedimController.webHook);

module.exports = router;
