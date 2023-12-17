const axios = require('axios');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Project } = require('../models');
const config = require('../config/config');

const getAllProjects = catchAsync(async (req, res) => {
    console.log('>>> GetAllProjects');
    const projects = await Project.find();
    res.status(200).send(projects);
})

const updateProjectById = catchAsync(async (req, res) => {
    console.log('>>> UpdateProject');
    console.log(req.params)
    await Project.findByIdAndUpdate(req.params.projectID, req.body);
    res.status(200).send(await Project.find());
})

const getProjectById = catchAsync(async (req, res) => {
    console.log('>>> Get Project By Id');
    const project = await Project.findById(req.params.projectID);
    if (project) {
        res.status(200).send(project);
    } else {
        res.status(500).send('Error');
    }
})

const uploadKaedimModel = catchAsync(async (req, res) => {
    console.log('>>> Upload model');
    await Project.findByIdAndUpdate(req.params.projectID, { 
        kaedim_status: true,
        fbxUrl: config.url + '/models/' + req.files['model'][0]['originalname']
    });
    res.status(200).send(await Project.find());
})

const uploadProjectionModel = catchAsync(async (req, res) => {
    console.log('>>> Upload model');
    await Project.findByIdAndUpdate(req.params.projectID, { 
        projection_status: true,
        fbxUrl: config.url + '/models/' + req.files['model'][0]['originalname']
    });
    res.status(200).send(await Project.find());
})

const uploadGltf = catchAsync(async (req, res) => {
    console.log('>>> Upload GLTF');
    await Project.findByIdAndUpdate(req.params.projectID, {
        is_project: true,
        fbxUrl: config.url + '/models/' + req.files['model'][0]['originalname']
    });
    res.status(200).send(await Project.findById(req.params.projectID));
})

module.exports = {
    getAllProjects,
    updateProjectById,
    getProjectById,
    uploadKaedimModel,
    uploadProjectionModel,
    uploadGltf
};
