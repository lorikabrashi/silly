const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');

router.get('/', auth.jwt.adm, function(req, res){
    res.json({
		confirmation: 'Success',
		results: 'Silly Admin API'
	});
});

module.exports = router;