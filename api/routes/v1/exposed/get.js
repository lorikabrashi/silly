const express = require('express');
const router = express.Router();
const catchException = require('../../../middlewares/catchException');
const controllers = require('../../../controllers/')
const { sendResponse } = require('../../../helpers/general');

router.get('/', catchException( async (req, res) => {
    res.json(sendResponse('Silly API'))
}));


module.exports = router;