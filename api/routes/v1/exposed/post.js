const express = require('express');
const router = express.Router();
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/');

router.post('/login', catchException(async (req, res) => {

    const result = await controllers['auth'].login(req.body);
    res.json({ 
        confirmation: 'Success', 
        results : result
    });

}));

router.post('/sign-up', catchException(async (req, res) => {

    req.body.role = 'user';
    await controllers['users'].create(req.body);
    
    res.json({ confirmation: 'Success'});

}));

router.post('/forgot-password', catchException(async (req, res) => {

}));

router.post('/forgot-username', catchException(async (req, res) => {

}));

router.post('/register-admin', catchException(async (req, res) => {
    
    req.body.role = 'admin';
    await controllers['users'].registerAdmin(req.body, true);
    
    res.json({ confirmation: 'Success'});   
   
}));

module.exports = router;