const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')
const ErrorWithStatusCode = require('../../../helpers/ErrorWithStatusCode')
const { sendResponse } = require('../../../helpers/general');

router.get('/', catchException(auth.adm.validateAccessToken), catchException(function(req, res){
    res.json(sendResponse('Silly Admin API'))
}));



router.get('/:resource', /* catchException(auth.adm.validateAccessToken), */ catchException(async function(req, res){
    
    const resource = req.params.resource;
	const controller = controllers[resource];

	if (controller == null || typeof controller.find !== "function")
		throw new ErrorWithStatusCode('Resource not found :' + resource, 404)
		
    const results = await controller.find(req.query);
    res.json(sendResponse(results))

}))


router.get('/:resource/:id', /* catchException(auth.adm.validateAccessToken), */ catchException(async function(req, res){
    
    const id = req.params.id
    const resource = req.params.resource;
	const controller = controllers[resource];

	if (controller == null || typeof controller.findById !== "function")
		throw new ErrorWithStatusCode('Resource not found :' + resource, 404)
		
    const results = await controller.findById(id, req.query);
    res.json(sendResponse(results))

}))

module.exports = router;