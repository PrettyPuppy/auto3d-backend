const axios = require('axios');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Project } = require('../models');
const config = require('../config/config');
const FormData = require('form-data');

let frontUrl, backUrl;

const enhanceImage = catchAsync(async (req, res) => {
    console.log('>>> Enhance Image', req.params.user_id);

    frontUrl = config.url + '/' + req.files['frontImage'][0]['originalname'];
    backUrl = config.url + '/' + req.files['backImage'][0]['originalname']

    let formData = new FormData();
    formData.append('front', frontUrl);
    formData.append('back', backUrl);
    formData.append('scale', '4');

    let request = {
        method: 'post',
        maxBodyLength: Infinity,
        url: config.enhance,
        headers: {
            ...formData.getHeaders()
        },
        data: formData
    };

    // axios.request(request)
    //     .then((response) => {
    //         res.status(200).send(JSON.stringify({
    //             front: config.enhance + '/' + response.data[0],
    //             back: config.enhance + '/' + response.data[1]
    //         }));
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });

    // res.status(200).send(JSON.stringify({
    //     front: 'https://5459-188-43-253-76.ngrok-free.app/123.png',
    //     back: 'https://5459-188-43-253-76.ngrok-free.app/123.png'
    // }))

    const newProject = new Project({
        user_id: req.params.user_id,
        fbxUrl: null,
        frontImage: 'https://7744-188-43-253-76.ngrok-free.app/123.png',
        backImage: 'https://7744-188-43-253-76.ngrok-free.app/123.png',
        kaedim_status: false,
        projection_status: false,
        kaedim_modeller: null,
        projection_modeller: null,
        score: 0
    });
    await newProject.save();
    res.status(200).send(newProject);

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

    console.log(`["${frontUrl}", "${backUrl}"]`);

    let data = new FormData();
    data.append('devID', config.kaedim.dev_id);
    data.append('imageUrls', `["${frontUrl}", "${backUrl}"]`);
    data.append('LoQ', 'standard');
    data.append('polycount', '20000');
    data.append('height', '200');
    data.append('test', 'false');

    // let request = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: 'https://api.kaedim3d.com/api/v1/process',
    //     headers: {
    //         'x-api-key': config.kaedim.api_key,
    //         'Authorization': req.body.jwt,
    //         'Content-Type': 'multipart/form-data',
    //         ...data.getHeaders()
    //     },
    //     data: data
    // };

    // axios.request(request)
    //     .then(async (response) => {
    //         console.log(response.data);
    //         res.status(200).send(response.data);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         res.status(404).send(error);
    //     });

    res.status(200).send(
        {
            status: 'success',
            devID: 'cbb22d7b-4ddb-4b2f-b47e-c847d9b45e37',
            requestID: '07b38659-52da-48e0-a5a2-ebaa756914e7',
            message: 'Request sent succesffuly, please check your webhook in 10-15 mins'
        }
    )

});

const fetchRequest = catchAsync(async (req, res) => {
    console.log('>>> Fetch Request \n', req.body);

    let data = JSON.stringify({
        "devID": config.kaedim.dev_id,
        "requestID": req.body.requestID
    });

    let request = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.kaedim3d.com/api/v1/fetchRequest',
        headers: {
            'x-api-key': config.kaedim.api_key,
            'Authorization': req.body.jwt,
            'Content-Type': 'application/json'
        },
        data: data
    };

    // axios.request(request)
    //     .then(async (response) => {

    //         const project = await Project.findById(req.body.user_id);
    //         console.log(project);

    //         console.log(response.data);
    //         res.status(200).send(response.data);
    //     })
    //     .catch((error) => {
    //         console.log('>>> Error in fetchRequest');
    //     });


        await Project.findByIdAndUpdate( req.body.id, {
            fbxUrl: 'https://7744-188-43-253-76.ngrok-free.app/cone.fbx',
            // fbxUrl: res.data.asset.interations[0].results.fbx,
        });
        res.status(200).send(await Project.findById(req.body.id));
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
    console.log('>> WebHook \n', req.body);
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
