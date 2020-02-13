const positionModel = require('../models/position')
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const { excractFields, getDefaultQueryParams } = require('../helpers/general');

module.exports = positionController = {
    create: async (params) => {
        params = { type, description } = params;
        const position = await positionModel.create(params);
        return `Created position - ${position._id}`
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const positions = await positionModel.find({}, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(positions).map(position => {
            return excractFields(position, qParams.fields);
        })
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const position = await positionModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });
        return excractFields(position, qParams.fields);
    },
    update: async(id, params) => {
        params = { type, description } = params;
        return await positionModel.findByIdAndUpdate(id, params, { new: true }).select('-__v').exec(); 
    },
    delete: async(id) => {
        const position = await positionModel.findByIdAndRemove(id).exec();
        return `Deleted position - ${position._id}`
    }
}