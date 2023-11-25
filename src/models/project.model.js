const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const projectSchema = mongoose.Schema(
    {
        devId: {
            type: String,
        },
        frontImage: {
            type: String,
        },
        backImage: {
            type: String,
        },
        fbxUrl: {
            type: String,
        },
        enhancedFUrl: {
            type: String,
        },
        enhancedBUrl: {
            type: String
        },
        kaedim_status: {
            type: Boolean,
        },
        projection_status: {
            type: Boolean,
        },
        kaedim_modeller: {
            type: String,
        },
        projection_modeller: {
            type: String,
        },
        score: {
            type: Number
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

/**
 * @typedef User
 */
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
