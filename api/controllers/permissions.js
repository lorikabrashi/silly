const permissionModel = require('../models/permission')
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const { excractFields, getDefaultQueryParams } = require('../helpers/general');

module.exports = permissionController = {
    create: async (params) => {
        params = { name, description, permissions } = params;

        const permission = await permissionModel.create(params)
        return `Created permission - ${permission._id}`
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const permissions = await permissionModel.find({}, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(permissions).map(permission => {
            return excractFields(permission, qParams.fields);
        })
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const permission = await permissionModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });
        return excractFields(permission, qParams.fields);
    },
    update: async(id, params) => {
        params = { name, description, permissions } = params;
        return await permissionModel.findByIdAndUpdate(id, params, { new: true }).select('-__v').exec(); 
    },
    delete: async(id) => {
        const permissions = await permissionModel.findByIdAndRemove(id).exec();
        return `Deleted permission - ${permissions._id}`
    }
}