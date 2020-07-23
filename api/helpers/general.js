const fs = require('fs')
const logger = require('morgan')
const multer = require('multer')

const getInnerChildArray = (resource, fields, isLast, child = null) => {
    const returnValuesArr = []
    const resourceArr = JSON.parse(JSON.stringify(resource))
    if (Array.isArray(resourceArr)) {
        resourceArr.forEach((elem) => {
            if (isLast && elem[fields]) {
                returnValuesArr.push({ [fields]: elem[fields] })
            } else {
                if (elem[child]) {
                    returnValuesArr.push({ [child]: getInnerChild(elem[child], fields, fields.length) })
                }
            }
        })
    }
    return returnValuesArr
}

const getInnerChild = (resource, fields, index) => {
    if (index == 1) {
        const returnValue = resource[fields]
        if (returnValue) {
            return { [fields]: returnValue }
        } else {
            return getInnerChildArray(resource, fields, true)
        }
    } else {
        const child = fields.shift()
        if (resource[child]) {
            return getInnerChild(resource[child], fields, fields.length)
        } else {
            return getInnerChildArray(resource, fields, false, child)
        }
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const filterImage = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    }
    cb(null, false)
}

const uploadFileSize = { fileSize: 1024 * 1024 * 5 }

module.exports = {
    getBoolean: (value) => {
        switch (value) {
            case true:
            case 'true':
            case 1:
            case '1':
            case 'on':
            case 'yes':
                return true
            default:
                return false
        }
    },
    isEmptyObject: (obj) => {
        if (!obj) throw new Error('No object provided!')
        return !Object.keys(obj).length
    },
    createFolder: (dir) => {
        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir)
            } catch (err) {
                console.log(err)
            }
        }
    },
    generateLogFile: (app, path, type) => {
        app.use(
            logger('common', {
                skip: function (req, res) {
                    if (type === 'errors') return res.statusCode < 400
                    else return res.statusCode >= 400
                },
                stream: fs.createWriteStream(path, { flags: 'a' }),
            })
        )
    },
    extractFields: (resource, fields) => {
        if (fields.length < 1) return resource
        const result = fields.reduce((newResource, field) => {
            if (field.includes('.')) {
                const splitField = field.split('.')
                newResource[field] = getInnerChild(resource, splitField, splitField.length)
            } else {
                newResource[field] = resource[field]
            }
            return newResource
        }, {})

        return result
    },
    getDefaultQueryParams: (params) => {
        let { offset, limit, fields } = params

        offset = Math.abs(parseInt(offset)) || 0
        limit = Math.abs(parseInt(limit)) || 50
        limit = Math.min(limit, 50)

        fields = fields ? fields.split(',') : []

        return { offset, limit, fields }
    },
    sendResponse: (results, confirmation = true) => {
        if (!confirmation) {
            return { confirmation: 'Fail', statusCode: results.statusCode || 500, message: results.message }
        }
        return { confirmation: 'Success', results }
    },
    multerUploadImage: multer({
        storage,
        limits: uploadFileSize,
        fileFilter: filterImage,
    }),
}
