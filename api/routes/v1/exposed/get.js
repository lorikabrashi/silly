const express = require('express');
const router = express.Router();
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')
const { sendResponse } = require('../../../helpers/general');

router.get('/', catchException( async (req, res) => {    
    res.json(sendResponse('Silly API'))
}));

router.get('/email-verification/:code', catchException( async (req, res) => {
    const code = req.params.code
    await controllers['users'].verifyUser(code);
    res.redirect(`${process.env.CLIENT_URL}/verification-success`)
}))


module.exports = router;