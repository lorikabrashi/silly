const express = require('express');
const router = express.Router();
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')

router.get('/', catchException( async (req, res) => {
    
    res.json({
        confirmation: 'Success',
        results: 'Silly Api'
    });   
}));


module.exports = router;