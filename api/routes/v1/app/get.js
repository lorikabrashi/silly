const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')

router.get('/', catchException(auth.app.validateAccessToken), catchException(async (req, res) => {
    res.json({
		confirmation: 'Success',
		results: 'Silly App API'
	});
}));




module.exports = router;