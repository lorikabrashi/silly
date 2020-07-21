const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const catchException = require('../../../middleware/catchException')
const controllers = require('../../../controllers/')
const ErrorWithStatusCode = require('../../../helpers/ErrorWithStatusCode')
const { sendResponse, multerUploadImage } = require('../../../helpers/general')
const validations = require('../../../helpers/validations')

router.put(
    '/update-avatar/:id',
    catchException(auth.adm.validateAccessToken),
    multerUploadImage.single('avatar'),
    catchException(async (req, res) => {
        const id = req.params.id

        if (!req.file) {
            throw new ErrorWithStatusCode('Image file not supplied', 401)
        }
        const path = req.file.path
        const avatar = path.replace('public\\', '')

        const result = await controllers.users.updateAvatar(id, avatar)
        res.json(sendResponse(result))
    })
)

router.put(
    '/update-profile/:id',
    catchException(auth.adm.validateAccessToken),
    validations.profile,
    catchException(async (req, res) => {
        validations.checkResults(req)

        const id = req.params.id
        const results = await controllers.users.updateProfile(id, req.body)
        res.json(sendResponse(results))
    })
)

router.put(
    '/update-password/:id',
    catchException(auth.adm.validateAccessToken),
    validations.password,
    catchException(async (req, res) => {
        validations.checkResults(req)

        const id = req.params.id
        const results = await controllers.users.updatePassword(id, req.body.password)
        res.json(sendResponse(results))
    })
)

router.put(
    '/:resource/:id',
    catchException(auth.adm.validateAccessToken),
    catchException(async function (req, res) {
        const id = req.params.id
        const resource = req.params.resource
        const controller = controllers[resource]

        if (controller == null || typeof controller.update !== 'function') {
            throw new ErrorWithStatusCode('Resource not found :' + resource, 404)
        }
        const results = await controller.update(id, req.body)
        res.json(sendResponse(results))
    })
)

module.exports = router
