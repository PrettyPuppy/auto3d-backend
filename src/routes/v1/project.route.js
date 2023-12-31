const express = require('express');
const validate = require('../../middlewares/validate');
const projectController = require('../../controllers/project.controller');
const auth = require('../../middlewares/auth');
const multer = require("multer");

const router = express.Router();

router.get('/getall', projectController.getAllProjects);
router.post('/update/:projectID', projectController.updateProjectById);
router.get('/getone/:projectID', projectController.getProjectById);
router.put('/updateScore/:projectID', projectController.updateScore);
router.put('/publish/:projectID', projectController.handlePublish);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/models/"); // This is where the uploaded files will be stored
    },
    filename: function (req, file, cb) {
        // You can define how the file should be named here (e.g., use a timestamp)
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });
router.post('/uploadKaedim/:projectID', upload.fields([{name: "model"}]), projectController.uploadKaedimModel);
router.post('/uploadProjection/:projectID', upload.fields([{name: "model"}]), projectController.uploadProjectionModel);
router.post('/uploadGltf/:projectID', upload.fields([{name: "model"}]), projectController.uploadGltf);

module.exports = router;
