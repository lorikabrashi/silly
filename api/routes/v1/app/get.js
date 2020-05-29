const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');
const catchException = require('../../../middleware/catchException');
const controllers = require('../../../controllers/')
const { sendResponse } = require('../../../helpers/general');

router.get('/', catchException(auth.app.validateAccessToken), catchException(async (req, res) => {
   res.json(sendResponse('Silly App API'))
}));




module.exports = router;