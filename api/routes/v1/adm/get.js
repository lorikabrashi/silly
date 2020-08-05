const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const catchException = require('../../../middleware/catchException')
const controllers = require('../../../controllers/')
const ErrorWithStatusCode = require('../../../helpers/ErrorWithStatusCode')
const { sendResponse } = require('../../../helpers/general')

router.get(
    '/',
    catchException(auth.adm.validateAccessToken),
    catchException((req, res) => {
        res.json(sendResponse('Silly Admin API'))
    })
)

router.get(
    '/get-admins',
    catchException(auth.adm.validateAccessToken),
    catchException(async (req, res) => {
        const results = await controllers.users.find(req.query, { role: 'admin' })
        res.json(sendResponse(results))
    })
)

router.get(
    '/get-users',
    catchException(auth.adm.validateAccessToken),
    catchException(async (req, res) => {
        const results = await controllers.users.find(req.query, { role: 'user' })
        res.json(sendResponse(results))
    })
)

router.get(
    '/get-user/:id',
    catchException(auth.adm.validateAccessToken),
    catchException(async (req, res) => {
        const id = req.params.id
        const results = await controllers.users.findById(id, req.query)
        res.json(sendResponse(results))
    })
)

router.get(
    '/get-categories/:order',
    catchException(auth.adm.validateAccessToken),
    catchException(async (req, res) => {
        const order = req.params.order
        const results = await controllers.categories.getCategories(order, req.query)
        res.json(sendResponse(results))
    })
)

router.get(
    '/get-default-permissions/',
    catchException(auth.adm.validateAccessToken),
    catchException(async (req, res) => {
        const results = await controllers.permissions.getDefaultPermissions(req.query)
        res.json(sendResponse(results))
    })
)

router.get(
    '/:resource',
    catchException(auth.adm.validateAccessToken),
    catchException(async (req, res) => {
        const resource = req.params.resource
        const controller = controllers[resource]

        if (controller == null || typeof controller.find !== 'function') {
            throw new ErrorWithStatusCode('Resource not found :' + resource, 404)
        }
        const results = await controller.find(req.query)
        res.json(sendResponse(results))
    })
)

router.get(
    '/:resource/:id',
    catchException(auth.adm.validateAccessToken),
    catchException(async (req, res) => {
        const id = req.params.id
        const resource = req.params.resource
        const controller = controllers[resource]

        if (controller == null || typeof controller.findById !== 'function') {
            throw new ErrorWithStatusCode('Resource not found :' + resource, 404)
        }
        const results = await controller.findById(id, req.query)
        res.json(sendResponse(results))
    })
)

module.exports = router
