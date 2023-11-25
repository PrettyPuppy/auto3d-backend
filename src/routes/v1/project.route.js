const express = require('express');
const validate = require('../../middlewares/validate');
const projectController = require('../../controllers/project.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/getAll', projectController.getAllProjects);

module.exports = router;
