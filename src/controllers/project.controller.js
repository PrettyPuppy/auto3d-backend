const axios = require('axios');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Project } = require('../models');
const config = require('../config/config');

const getAllProjects = catchAsync(async (req, res) => {
    console.log('>> GetAllProjects');
    const projects = await Project.find();
    res.status(200).send(projects);
})

module.exports = {
    getAllProjects,
};
