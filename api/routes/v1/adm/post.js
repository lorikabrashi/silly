const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const catchException = require('../../../middleware/catchException')
const controllers = require('../../../controllers/')
const ErrorWithStatusCode = require('../../../helpers/ErrorWithStatusCode')
const { sendResponse } = require('../../../helpers/general')
const validations = require('../../../helpers/validations')

router.post(
    'add-permission',
    catchException(auth.adm.validateAccessToken),
    validations.addRemoveProjectFields,
    catchException(async (req, res) => {
        validations.checkResults(req)
        const { projectId, ids } = req.body

        // TODO
        // const results = await controllers.projects.addPermission(projectId, ids)
        res.json(sendResponse({ projectId, ids }))
    })
)

router.post(
    'remove-permission',
    catchException(auth.adm.validateAccessToken),
    validations.addRemoveProjectFields,
    catchException(async (req, res) => {
        validations.checkResults(req)
        const { projectId, ids } = req.body

        // TODO
        // const results = await controllers.projects.removePermission(projectId, ids)
        res.json(sendResponse({ projectId, ids }))
    })
)

router.post(
    '/add-category',
    catchException(auth.adm.validateAccessToken),
    validations.addRemoveProjectFields,
    catchException(async (req, res) => {
        validations.checkResults(req)
        const { projectId, ids } = req.body
        const results = await controllers.projects.addCategories(projectId, ids)
        res.json(sendResponse(results))
    })
)

router.post(
    '/remove-category',
    catchException(auth.adm.validateAccessToken),
    validations.addRemoveProjectFields,
    catchException(async (req, res) => {
        validations.checkResults(req)
        const { projectId, ids } = req.body
        const results = await controllers.projects.removeCategories(projectId, ids)
        res.json(sendResponse(results))
    })
)

router.post(
    '/token',
    catchException(auth.adm.validateAccessTokenExp),
    validations.refreshToken,
    catchException(async (req, res) => {
        validations.checkResults(req)
        const { refreshToken } = req.body
        const result = await controllers.auth.generateNewAccessToken(req.decoded, refreshToken)
        res.json(sendResponse(result))
    })
)

router.post(
    '/sign-out',
    catchException(auth.adm.validateAccessToken),
    validations.refreshToken,
    catchException(async (req, res) => {
        validations.checkResults(req)
        const { refreshToken } = req.body
        const result = await controllers.auth.logout(req.decoded._id, refreshToken)
        res.json(sendResponse(result))
    })
)

router.post(
    '/:resource',
    catchException(auth.adm.validateAccessToken),
    catchException(async (req, res) => {
        const resource = req.params.resource
        const controller = controllers[resource]

        if (controller == null || typeof controller.create !== 'function') {
            throw new ErrorWithStatusCode('Resource not found :' + resource, 404)
        }
        if (resource in validations) {
            await Promise.all(validations[resource].map((validation) => validation.run(req)))
            validations.checkResults(req)
        }

        const results = await controller.create(req.body)
        res.json(sendResponse(results))
    })
)

module.exports = router
