const projectModel = require('../models/project')
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const { excractFields, getDefaultQueryParams } = require('../helpers/general');

module.exports = projectController = {
    create: async (params) => {

        params = { name, description, license, categories, stage, created_from } = params;
        const project = await projectModel.create(params);
        return `Created project - ${project._id}`
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const projects = await projectModel.find({}, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(projects).map(project => {
            return excractFields(project, qParams.fields);
        })
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const project = await projectModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });
        return excractFields(project, qParams.fields);
    },
    update: async(id, params) => {
        params = { name, description, license, categories, stage } = params;
        return await projectModel.findByIdAndUpdate(id, params, { new: true }).select('-__v').exec(); 
    },
    delete: async(id) => {
        const project = await projectModel.findByIdAndRemove(id).exec();
        return `Deleted project - ${project._id}`
    }
}