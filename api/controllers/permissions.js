const permissionModel = require('../models/permission')
const { validateReqFields } = require('../helpers/validations')
const { extractFields, getDefaultQueryParams } = require('../helpers/general')

module.exports = {
    getDefaultPermissions: async (qParams) => {
        qParams = getDefaultQueryParams(qParams)
        const query = { 'config.type': 'Default' }
        const permissions = await permissionModel.find(query, { __v: 0 }, { skip: qParams.offset, limit: qParams.limit })
        return Array.from(permissions).map((permission) => {
            return extractFields(permission, qParams.fields)
        })
    },
    createCustom: async (params) => {
        validateReqFields(params, ['parent_id'])
        const { parent_id } = params
        const fields = {
            name: params.name,
            description: params.description,
            permissions: params.permissions,
            config: {
                type: 'Custom',
                parent_id: parent_id,
            },
        }

        const permission = await permissionModel.create(fields)
        return `Created permission - ${permission._id}`
    },
    create: async (params) => {
        const fields = {
            name: params.name,
            description: params.description,
            permissions: params.permissions,
            config: {
                type: 'Default',
            },
        }
        const permission = await permissionModel.create(fields)
        return `Created permission - ${permission._id}`
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams)
        const permissions = await permissionModel.find({}, { __v: 0 }, { skip: qParams.offset, limit: qParams.limit })

        return Array.from(permissions).map((permission) => {
            return extractFields(permission, qParams.fields)
        })
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams)
        const permission = await permissionModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit: qParams.limit })
        return extractFields(permission, qParams.fields)
    },
    update: async (id, params) => {
        const fields = {
            name: params.name,
            description: params.description,
            permissions: params.permissions,
        }
        return await permissionModel.findByIdAndUpdate(id, fields, { new: true }).select('-__v').exec()
    },
    delete: async (id) => {
        /* TODO: deleted => update projects/project (default/custom) */
        const permissions = await permissionModel.findByIdAndRemove(id).exec()
        return `Deleted permission - ${permissions._id}`
    },
}
