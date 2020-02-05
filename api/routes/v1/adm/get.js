const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')

router.get('/', catchException(auth.adm.validateAccessToken), catchException(function(req, res){
    res.json({
		confirmation: 'Success',
		results: 'Silly Admin API'
	});
}));

module.exports = router;