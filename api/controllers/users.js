const usersModel = require('../models/user')
const profilesModel = require('../models/profile')
const { extractFields, getDefaultQueryParams } = require('../helpers/general')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const validations = require('../helpers/validations')
const mailConfig = require('../helpers/mailConfig')

const userController = {
    resetPassword: async (params, token) => {
        const password = bcrypt.hashSync(params.password, parseInt(process.env.SALT_ROUNDS))
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY_PASSWORD_RESET, (err, decoded) => {
                if (err) {
                    reject(err)
                }
                resolve(decoded)
            })
        }).catch((err) => {
            throw new ErrorWithStatusCode(err.message, err.statusCode)
        })
        await usersModel.updateOne({ email: decoded.email }, { password })
    },
    requestPasswordReset: async (params) => {
        const { email } = params
        const user = await usersModel.findOne({ email }).exec()
        if (!user) {
            throw new ErrorWithStatusCode("User witth this email doesn't exist", 404)
        }
        const JWT_data = { email }
        const token = jwt.sign(JWT_data, process.env.JWT_KEY_PASSWORD_RESET, { expiresIn: process.env.JWT_KEY_PASSWORD_RESET_EXP })

        await mailConfig.sendMail(mailConfig.templates.resetPassword(user.username, email, token))
    },
    verifyUser: async (token) => {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_KEY_VERIFICATION, (err, decoded) => {
                if (err) {
                    reject(err)
                }
                resolve(decoded)
            })
        }).catch((err) => {
            throw new ErrorWithStatusCode(err.message, err.statusCode)
        })

        const user = await usersModel.findOne({ email: decoded.email }).exec()
        if (!user) {
            throw new ErrorWithStatusCode("User with this email doesn't exist", 404)
        }
        if (user.verified) {
            throw new ErrorWithStatusCode('User already verified', 400)
        }
        await usersModel.updateOne({ _id: user._id }, { verified: true }).exec()
    },
    updateAvatar: async (id, avatar) => {
        const user = await usersModel.findById(id).exec()
        if ('profile' in user._doc) {
            await profilesModel.update({ _id: user.profile }, { avatar }).exec()
        } else {
            const profile = await profilesModel.create({ avatar })
            await usersModel.update({ _id: id }, { profile: profile._id }).exec()
        }
        return 'Avatar Updated'
    },
    updatePassword: async (id, password) => {
        password = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS))
        return await usersModel.update({ _id: id }, { password }).exec()
    },
    // Update user and profile fields
    updateProfile: async (id, params) => {
        const fields = {
            username: params.username,
            first_name: params.first_name,
            last_name: params.last_name,
            phone_number: params.phone_number,
        }

        if (fields.username) {
            await usersModel.update({ _id: id }, { username: fields.username }).exec()
        }

        const user = await usersModel.findById(id).exec()
        if ('profile' in user._doc) {
            const profileID = user.profile
            await profilesModel.update({ _id: profileID }, fields).exec()
        } else {
            const profile = await profilesModel.create(fields)
            await usersModel.update({ _id: id }, { profile: profile._id }).exec()
        }

        return await userController.findById(id)
    },
    hasAdmin: async () => {
        const countAdmins = await usersModel.count({ role: 'admin' }).exec()
        if (countAdmins) return true
        return false
    },
    registerAdmin: async (params, installation) => {
        if (installation) {
            const countAdmins = await usersModel.count({ role: 'admin' }).exec()
            if (countAdmins > 0) throw new ErrorWithStatusCode('Account already exists', 502)
        }
        params.role = 'admin'
        params.verified = true
        return await userController.create(params)
    },

    register: async (params) => {
        const fields = {
            username: params.username,
            password: params.password,
            email: params.email,
        }

        fields.role = 'user'
        fields.verified = false

        if (fields.password) {
            fields.password = bcrypt.hashSync(fields.password, parseInt(process.env.SALT_ROUNDS))
        }

        const JWT_data = { email: fields.email }
        const verification_token = jwt.sign(JWT_data, process.env.JWT_KEY_VERIFICATION, { expiresIn: process.env.JWT_KEY_VERIFICATION_EXP })

        await mailConfig.sendMail(mailConfig.templates.verification(fields.username, fields.email, verification_token))

        const user = await usersModel.create(fields)
        return `Created user - ${user._id}`
    },

    create: async (params) => {
        const fields = {
            username: params.username,
            password: params.password,
            email: params.email,
            role: params.role,
        }
        fields.verified = true
        if (fields.password) {
            fields.password = bcrypt.hashSync(fields.password, parseInt(process.env.SALT_ROUNDS))
        }

        const user = await usersModel.create(fields)
        return `Created user - ${user._id}`
    },

    find: async (qParams = {}, body = {}) => {
        console.log(qParams);
        qParams = getDefaultQueryParams(qParams)
        const users = await usersModel.find(body, { password: 0, __v: 0 }, { skip: qParams.offset, limit: qParams.limit })

        return Array.from(users).map((user) => {
            return extractFields(user, qParams.fields)
        })
    },

    findById: async (id, qParams = {}) => {
        qParams = getDefaultQueryParams(qParams)
        const user = await usersModel.findById(id, { password: 0, __v: 0 }, { skip: qParams.offset, limit: qParams.limit })

        return extractFields(user, qParams.fields)
    },

    update: async (id, params) => {
        const fields = {
            username: params.username,
            password: params.password,
            email: params.email,
            role: params.role,
        }

        if (fields.password) {
            validations.validatePassword(fields.password)
            fields.password = bcrypt.hashSync(fields.password, parseInt(process.env.SALT_ROUNDS))
        }

        return await usersModel.findByIdAndUpdate(id, fields, { new: true }).select('-password').select('-__v').exec()
    },

    delete: async (id) => {
        const user = await usersModel.findByIdAndRemove(id).exec()
        return `Deleted user - ${user._id}`
    },
}
module.exports = userController
