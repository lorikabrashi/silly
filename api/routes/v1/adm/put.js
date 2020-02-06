const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')
const ErrorWithStatusCode = require('../../../helpers/ErrorWithStatusCode')
const { sendResponse } = require('../../../helpers/general');



router.put('/:resource/:id', /* catchException(auth.adm.validateAccessToken), */ catchException(async function(req, res){
    
    const id = req.params.id
    const resource = req.params.resource;
	const controller = controllers[resource];

	if (controller == null || typeof controller.update !== "function")
		throw new ErrorWithStatusCode('Resource not found :' + resource, 404)
		
    const results = await controller.update(id, req.body);
    res.json(sendResponse(results))

}))

module.exports = router;