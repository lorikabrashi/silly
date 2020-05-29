const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const catchException = require('../../../middleware/catchException');
const controllers = require('../../../controllers/')
const validations = require('../../../helpers/validations');
const { sendResponse } = require('../../../helpers/general');


router.post('/invite-peer', validations.invitePeer, /* catchException(auth.app.validateAccessTokenExp), */ catchException(async (req, res) => {
    validations.checkResults(req);

    const result = await controllers['projects'].invitePeer(req.body, '5e6bb4c0b4f9723288e48026');// req.decoded._id);
    res.json(sendResponse(result));
}));

router.post('/invitation-response', validations.invitationResponse, /* catchException(auth.app.validateAccessTokenExp), */ catchException(async (req, res) => {
    validations.checkResults(req);

    const result = await controllers['projects'].invitationResponse(req.body, '5e6bb4c0b4f9723288e48026')// req.decoded._id);
    res.json(sendResponse(result));
}));

router.post('/token', validations.refreshToken, catchException(auth.app.validateAccessTokenExp), catchException(async (req, res) => {
    validations.checkResults(req);

    const { refreshToken } = req.body;
    const result = await controllers['auth'].generateNewAccessToken(req.decoded, refreshToken);
    res.json(sendResponse(result))
}));

router.post('/sign-out', validations.refreshToken, catchException(auth.app.validateAccessToken), catchException(async (req, res) => {
    validations.checkResults(req);
    
    const { refreshToken } = req.body;
    const result = await controllers['auth'].logout(req.decoded._id, refreshToken);
    res.json(sendResponse(result))
}));

router.post('/create-project',  /* catchException(auth.app.validateAccessToken), */ catchException(async (req, res) => {

    const response = {
        message: 'Test'
    };
    res.json(sendResponse(response));
}))

module.exports = router;