const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const catchException = require('../../../middleware/catchException')
const controllers = require('../../../controllers/')
const ErrorWithStatusCode = require('../../../helpers/ErrorWithStatusCode')
const { sendResponse } = require('../../../helpers/general')

router.delete(
    '/:resource/:id',
    catchException(auth.adm.validateAccessToken),
    catchException(async function (req, res) {
        const id = req.params.id
        const resource = req.params.resource
        const controller = controllers[resource]

        if (controller == null || typeof controller.delete !== 'function') {
            throw new ErrorWithStatusCode('Resource not found :' + resource, 404)
        }
        const results = await controller.delete(id)
        res.json(sendResponse(results))
    })
)

module.exports = router
