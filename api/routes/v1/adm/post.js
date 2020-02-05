const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')

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


module.exports = router;