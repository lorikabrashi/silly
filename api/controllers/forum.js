const forumModel = require('../models/forum');
const positionModel = require('../models/position');
const projectModel = require('../models/project');
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const { extractFields, getDefaultQueryParams } = require('../helpers/general');
const { validateReqFields } = require ('../helpers/validations');
module.exports = forumController = {
    create: async (params) => {
        if(params.config.type !== 'child'){
            validateReqFields(params, ['title']);
        }
        params = { title, content, attachments, config } = params;  
     
        const post = await forumModel.create(params);
        const parent_id = config.parent_id;

        switch (params.config.type) {
            case 'position':
                await positionModel.update({_id: parent_id}, { $push: { qa: post._id } }).exec();
                break;
            case 'project':
                await projectModel.update({_id: parent_id}, { $push: { qa: post._id } }).exec();
                break;
            default:
                await forumModel.update({_id: parent_id}, { $push: { comments: post._id } }).exec();
                break;
        }           
        return `Created Topic/Comment - ${post._id}`
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const posts = await forumModel.find({}, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(posts).map(post => {
            return extractFields(post, qParams.fields);
        });
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const post = await forumModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });
        return extractFields(post, qParams.fields);
    },
    update: async(id, params) => {
        params = { title, content, attachments } = params;
        return await forumModel.findByIdAndUpdate(id, params, { new: true }).select('-__v').exec(); 
    },
    delete: async(id) => {
        const post = await forumModel.findByIdAndRemove(id).exec();
        return `Deleted Topic/Comment - ${post._id}`
    }
}