const { check, validationResult } = require('express-validator')
const ErrorWithStatusCode = require('./ErrorWithStatusCode')
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/
const passwordMessage = 'Password should not be empty, minimum six characters, at least one letter, one number and one special character'

// prettier-ignore
module.exports = {
    refreshToken: [
        check('refreshToken', 'Refresh Token cannot be empty').notEmpty()
    ],
    password: [
        check('password', passwordMessage).exists().isLength({ min: 6 }).matches(passwordRegex)
    ],
    email: [
        check('email', 'Email field must be a valid email address!').isEmail()
    ],
    users: [
        check('username', 'Username cannot be empty').notEmpty(),
        check('email', 'Email field must be a valid email address!').isEmail(),
        check('password', passwordMessage).exists().isLength({ min: 6 }).matches(passwordRegex)
    ],
    profile: [
        check('first_name', 'First name cannot be empty').notEmpty(),
        check('last_name', 'Last Name cannot be empty').notEmpty()
    ],
    licenses: [
        check('name', 'License name cannot be empty').notEmpty(),
        check('description', 'License description cannot be empty').notEmpty()
    ],
    categories: [
        check('name', 'Category name cannot be empty').notEmpty()
    ],
    addRemoveProjectFields: [
        check('projectId', 'projectId cannot be empty and must be a project ID').isMongoId().notEmpty(),
        check('ids', 'id Fields not selected').isArray().notEmpty()
    ],
    permissions: [
        check('name', 'Permission name cannot be empty').notEmpty(),
        check('description', 'Permission description cannot be empty').notEmpty(),
        check('permissions', 'At least one permission needs to be set').notEmpty(),
        check('permissions.*', 'Permissions need to be boolean').isBoolean()
    ],
    forum: [
        check('content', 'Content cannot be empty').notEmpty(),
        check('user', "user cannot be empty and must be an id reference of 'users'").notEmpty().isMongoId(), // TODO - Get from access token
        check('config', 'Config cannot be empty').notEmpty(),
        check('config.type', "Config type must be: 'project', 'position' or 'child'").isIn(['project', 'position', 'child']),
        check('config.parent_id', "Config parent_id cannot be empty and must be an id reference of 'project', 'position' or 'forum'").notEmpty().isMongoId(),
    ],
    positions: [
        check('type', 'Position type cannot be empty').notEmpty(),
        check('description', 'Position description cannot be empty').notEmpty(),
        check('parent_id', 'parent_id cannot be empty and must be an id reference to projects').notEmpty().isMongoId()
    ],
    projects: [
        check('name', 'Project name cannot be empty').notEmpty(),
        check('description', 'Project description cannot be empty').notEmpty(),
        check('license', 'Project license cannot be empty and must be an id reference to a license').notEmpty().isMongoId(),
        check('categories', 'Project must have at least one category').notEmpty(),
        check('categories.*', 'Category must be an id reference to a category').isMongoId(),
        check('stage', 'Stage must be one of these values: "initiation", "planning", "execution" or "closure"').isIn(['initiation', 'planning', 'execution', 'closure']),
        check('created_from', 'created_from cannot be empty and must be an id reference to a user').notEmpty().isMongoId(), // TODO - Get from access token
    ],
    invitePeer: [
        check('title', 'Position Title cannot be empty').notEmpty(),
        check('description', 'Position description cannot be empty').notEmpty(),
        check('username', 'Username cannot be empty').notEmpty(),
        check('projectId', 'projectId cannot be empty and must be an id reference to one of your projects').notEmpty().isMongoId(),
        check('permissionsId', 'permissionsId cannot be empty and must be an id reference to a permission').notEmpty().isMongoId(),
    ],
    invitationResponse: [
        check('reason', 'Response reason cannot be empty').notEmpty(),
        check('response', 'Response cannot be empty and needs to be a boolean value').notEmpty().isBoolean(),
        check('projectId', 'projectId cannot be empty and must be an id reference to one of your projects').notEmpty().isMongoId(),
    ],

    /**
     * @param { string } password - Validate password
     */
    validatePassword: (password) => {
        const isValid = passwordRegex.test(password)
        if (!isValid) {
            throw new ErrorWithStatusCode(passwordMessage, 400)
        }
        return true
    },
    /**
     * @param { object } params - object params form body
     * @param { Array } fields - array fields to be required
     */
    validateReqFields: (params, fields) => {
        fields.forEach((elem) => {
            if (!(elem in params)) {
                throw new ErrorWithStatusCode(`${elem} cannot be empty`, 400)
            }
        })
    },
    /**
     * @param { object } req - request object to validate
     */
    checkResults: (req) => {
        const errorResults = validationResult(req)
        if (!errorResults.isEmpty()) throw new ErrorWithStatusCode(errorResults.errors[0].msg, 400)
    },
}
