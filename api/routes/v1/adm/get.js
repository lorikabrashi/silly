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

router.get('/new-access-token', catchException(auth.adm.validateRefreshToken), catchException(async (req, res) => {
    const result = await controllers['auth'].generateNewAccessToken(req.decoded);
    res.json({ 
        confirmation: 'Success', 
        results: result
    });
}));

router.get('/sign-out', catchException(auth.adm.validateAccessToken), catchException(async (req, res) => {
    const result = await controllers['auth'].logout(req.decoded._id);
     res.json({ 
        confirmation: 'Success', 
        results: result
    });
}));

module.exports = router;