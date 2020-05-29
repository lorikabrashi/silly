const licenseModel = require('../models/license')
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const { extractFields, getDefaultQueryParams } = require('../helpers/general');

module.exports = licenseController = {
    create: async (params) => {
        params = { name, description } = params;
        const license = await licenseModel.create(params)
        return `Created license - ${license._id}`
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const licenses = await licenseModel.find({}, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(licenses).map(license => {
            return extractFields(license, qParams.fields);
        })
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const license = await licenseModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });
        return extractFields(license, qParams.fields);
    },
    update: async(id, params) => {
        params = { name, description } = params;
        return await licenseModel.findByIdAndUpdate(id, params, { new: true }).select('-__v').exec(); 
    },
    delete: async(id) => {
        const license = await licenseModel.findByIdAndRemove(id).exec();
        return `Deleted license - ${license._id}`
    }
}