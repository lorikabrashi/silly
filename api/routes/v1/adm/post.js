const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')
const { sendResponse } = require('../../../helpers/general');

router.get('/token', catchException(auth.adm.validateAccessTokenExp), catchException(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await controllers['auth'].generateNewAccessToken(req.decoded, refreshToken);
    res.json({ 
        confirmation: 'Success', 
        results: result
    });
}));

router.post('/sign-out', catchException(auth.adm.validateAccessToken), catchException(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await controllers['auth'].logout(req.decoded._id, refreshToken);
     res.json({ 
        confirmation: 'Success', 
        results: result
    });
}));


router.post('/:resource', /* catchException(auth.adm.validateAccessToken), */ catchException(async function(req, res){
    
    const resource = req.params.resource;
	const controller = controllers[resource];

	if (controller == null || typeof controller.create !== "function")
		throw new ErrorWithStatusCode('Resource not found :' + resource, 404)
		
    const results = await controller.create(req.body);
    res.json(sendResponse(results))

}))

module.exports = router;