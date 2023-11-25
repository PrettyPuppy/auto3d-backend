const axios = require('axios');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Project } = require('../models');
const config = require('../config/config');
const FormData = require('form-data');

let timeoutId;

const enhanceImage = catchAsync(async (req, res) => {
    console.log('>>> Enhance Image', req.body);

    let request = {
        method: 'post',
        maxBodyLength: Infinity,
        url: config.enhance,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            frontUrl: req.body.frontUrl,
            backUrl: req.body.backUrl,
        })
    };

    axios.request(request)
        .then( async (response) => {
            console.log(response.data);

            const newProject = new Project({
                devId: config.kaedim.dev_id,
                frontImage: req.body.frontUrl,
                backImage: req.body.backUrl,
                enhancedFUrl: response.data.enhancedFUrl,
                enhancedBUrl: response.data.enhancedBUrl,
                kaedim_status: false,
                projection_status: false,
                kaedim_modeller: 'undefined',
                projection_modeller: 'undefined',
                score: 0
            });
            await newProject.save();

            res.status(200).send(newProject);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        })
})

const registerHook = catchAsync(async (req, res) => {
    console.log('>>> Register Webhook \n');
    const url = "https://api.kaedim3d.com/api/v1/registerHook"
    const headers = {
        "Content-Type": "application/json",
        "X-API-Key": config.kaedim.api_key
    }
    const body = {
        'devID': config.kaedim.dev_id,
        'destination': config.kaedim.destination
    }

    try {
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        }).then((ans) => {
            ans.json().then((data) => {
                console.log(data);
                res.status(200).send(data);
            });
        });
    } catch (e) {
        console.error(e);
        res.status(404).send(e);
    }
});

const process = catchAsync(async (req, res) => {
    console.log('>>> Process \n', req.body);
    console.log(req.body.url1);

    let data = new FormData();
    data.append('devID', config.kaedim.dev_id);
    // data.append('imageUrls', '["https://i.etsystatic.com/34890740/r/il/19754a/3790229567/il_1080xN.3790229567_ps88.jpg"]');
    data.append('imageUrls', `["${req.body.url1}", "${req.body.url2}"]`);
    data.append('LoQ', 'standard');
    data.append('polycount', '20000');
    data.append('test', 'true');

    console.log(data);

    let request = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.kaedim3d.com/api/v1/process',
        headers: {
            'x-api-key': config.kaedim.api_key,
            'Authorization': req.body.jwt,
            'Content-Type': 'multipart/form-data',
            ...data.getHeaders()
        },
        data: data
    };

    axios.request(request)
        .then( async (response) => {
            console.log(response.data);
            res.status(200).send(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(404).send(error);
        });

});

const fetchRequest = catchAsync(async (req, res) => {
    console.log('>>> Fetch Request \n', req.body);
    const url = `https://api.kaedim3d.com/api/v1/fetchRequest/?devID=${req.body.devID}&requestID=${req.body.requestID}`
    const headers = {
        "X-API-Key": config.kaedim.api_key,
        "Authorization": req.body.jwt
    };

    try {
        fetch(url, {
            method: 'GET',
            headers: headers,
        }).then((ans) => {
            console.log(ans);
            // ans.json().then((data) => {
            // console.log(data);
            // res.status(200).send(data);
            // });
        });
    } catch (e) {
        console.error(e);
        res.status(404).send(e);
    }

    timeoutId = setTimeout(fetchRequest, 2000);
});

const fetchAll = catchAsync(async (req, res) => {
    const url = `https://api.kaedim3d.com/api/v1/fetchAll/?devID=${config.kaedim.dev_id}`;
    const headers = {
        "X-API-Key": config.kaedim.api_key,
        "Authorization": req.body.jwt
    }
    try {
        fetch(url, {
            method: 'GET',
            headers: headers,
            timeout: 100000,
        }).then((ans) => {
            ans.json().then((data) => {
                console.log(data);
                res.status(200).send(data);
            });
        });
    } catch (e) {
        console.error(e);
        res.status(404).send(e);
    }
});

const refreshJWT = catchAsync(async (req, res) => {
    console.log('>>> Refresh Token \n');

    let request = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.kaedim3d.com/api/v1/refreshJWT',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.kaedim.api_key,
            'refresh-token': config.kaedim.refresh_token
        },
        data: JSON.stringify({
            "devID": config.kaedim.dev_id
        })
    };

    axios.request(request)
        .then((response) => {
            console.log(response.data);
            res.status(200).send(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(404).send(error);
        });
});

const webHook = catchAsync(async (req, res) => {
    console.log('>> WebHook', req.body);
    res.status(200).send('Success');
})

module.exports = {
    registerHook,
    process,
    fetchRequest,
    fetchAll,
    refreshJWT,
    enhanceImage,
    webHook
};
