const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')
const ErrorWithStatusCode = require('../../../helpers/ErrorWithStatusCode')
const { sendResponse } = require('../../../helpers/general');
const validations = require('../../../helpers/validations');
const { validationResult } = require('express-validator');


router.get('/token', catchException(auth.adm.validateAccessTokenExp), catchException(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await controllers['auth'].generateNewAccessToken(req.decoded, refreshToken);
    res.json(sendResponse(result))
}));

router.post('/sign-out', catchException(auth.adm.validateAccessToken), catchException(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await controllers['auth'].logout(req.decoded._id, refreshToken);
    res.json(sendResponse(result))
}));

router.post('/:resource', /* catchException(auth.adm.validateAccessToken), */  catchException(async function(req, res){
    	
    const resource = req.params.resource;
	const controller = controllers[resource];

	if (controller == null || typeof controller.create !== "function")
		throw new ErrorWithStatusCode('Resource not found :' + resource, 404)

    if(resource in validations){
        await Promise.all(validations[resource].map(validation => validation.run(req)));

        const errorResults = validationResult(req);
        if (!errorResults.isEmpty()) throw new ErrorWithStatusCode(errorResults.errors[0].msg, 400)
    }

    const results = await controller.create(req.body);
    res.json(sendResponse(results))

}));

module.exports = router;