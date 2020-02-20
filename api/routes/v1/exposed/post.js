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

router.post('/sign-up', catchException(async (req, res) => {

    req.body.role = 'user';
    await controllers['users'].create(req.body);
    res.json(sendResponse('Sing-up success'))
}));

router.post('/forgot-password', catchException(async (req, res) => {

}));

router.post('/forgot-username', catchException(async (req, res) => {

}));

router.post('/register-admin', validations.users, catchException(async (req, res) => {
    
    const errorResults = validationResult(req);
    if (!errorResults.isEmpty()) throw new ErrorWithStatusCode(errorResults.errors[0].msg, 400)

    req.body.role = 'admin';
    await controllers['users'].registerAdmin(req.body, true);
    
    res.json(sendResponse('Register Success'))   
   
}));

module.exports = router;