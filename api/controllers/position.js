const positionModel = require('../models/position');
const projectModel = require('../models/project');
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode');
const { extractFields, getDefaultQueryParams } = require('../helpers/general');

module.exports = positionController = {
    create: async (params) => {
        params = { type, description, status, parent_id } = params;
        const position = await positionModel.create(params);
        await projectModel.update({ _id: parent_id }, { $push: { positions: position._id } })
        
        return `Created position - ${position._id}`;
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const positions = await positionModel.find({}, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(positions).map(position => {
            return extractFields(position, qParams.fields);
        })
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const position = await positionModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });
        return extractFields(position, qParams.fields);
    },
    update: async(id, params) => {
        params = { type, description, status } = params;
        return await positionModel.findByIdAndUpdate(id, params, { new: true }).select('-__v').exec(); 
    },
    delete: async(id) => {
        const position = await positionModel.findByIdAndRemove(id).exec();
        return `Deleted position - ${position._id}`
    }
}