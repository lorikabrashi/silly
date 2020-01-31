const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.json({
		confirmation: 'Success',
		results: 'Silly Admin API'
	});
});

module.exports = router;