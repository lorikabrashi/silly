const express = require('express');
const router = express.Router();
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/');
const validations = require('../../../helpers/validations');
const { validationResult } = require('express-validator');
const { sendResponse } = require('../../../helpers/general');

router.post('/login', catchException(async (req, res) => {

    const result = await controllers['auth'].login(req.body);
    res.json(sendResponse(result))
}));

router.post('/sign-up', validations.users, catchException(async (req, res) => {
    await controllers['users'].register(req.body);
    res.json(sendResponse('Sing-up success'))
}));

router.post('/request-forgot-password', validations.email, catchException(async (req, res) => {
    await controllers['users'].requestPasswordReset(req.body);
    res.json(sendResponse('Email sent!'))
}));

router.post('/forgot-password/:code', validations.password, catchException(async (req, res) => {
    const code = req.params.code
    await controllers['users'].resetPassword(req.body, code);
    res.json(sendResponse('Password Reset Success'))
}));


router.post('/register-admin', validations.users, catchException(async (req, res) => {
    
    const errorResults = validationResult(req);
    if (!errorResults.isEmpty()) throw new ErrorWithStatusCode(errorResults.errors[0].msg, 400)

    await controllers['users'].registerAdmin(req.body, true);
    res.json(sendResponse('Register Success'))   
   
}));

module.exports = router;