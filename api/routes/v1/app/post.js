const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')
const { sendResponse } = require('../../../helpers/general');


router.post('/invite-peer', /* catchException(auth.app.validateAccessTokenExp), */ /* validate body */ catchException(async (req, res) => {
    const result = await controllers['projects'].invitePeer(req.body, '5e4c28d54f0ea218a47eb111');// req.decoded._id);
    res.json(sendResponse(result));
}));


router.post('/invitation-response', /* catchException(auth.app.validateAccessTokenExp), */ /* validate body */ catchException(async (req, res) => {
    const result = await controllers['projects'].invitationResponse(req.body, '5e70bfebb4bb6934c4efb598')// req.decoded._id);
    res.json(sendResponse(result));
}));



router.post('/token', catchException(auth.app.validateAccessTokenExp), catchException(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await controllers['auth'].generateNewAccessToken(req.decoded, refreshToken);
    res.json(sendResponse(result))
}));

router.post('/sign-out', catchException(auth.app.validateAccessToken), catchException(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await controllers['auth'].logout(req.decoded._id, refreshToken);
    res.json(sendResponse(result))
}));



module.exports = router;