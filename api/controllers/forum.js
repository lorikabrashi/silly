const forumModel = require('../models/forum')
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const { excractFields, getDefaultQueryParams } = require('../helpers/general');

module.exports = forumController = {
    create: async (params) => {
        params = { title, content, attachments, comments, parent } = params;
        const post = await forumModel.create(params);
        return `Created Topic/Comment - ${post._id}`
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const posts = await forumModel.find({}, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(posts).map(post => {
            return excractFields(post, qParams.fields);
        });
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const post = await forumModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });
        return excractFields(post, qParams.fields);
    },
    update: async(id, params) => {
        params = { title, content, attachments, comments } = params;
        return await forumModel.findByIdAndUpdate(id, params, { new: true }).select('-__v').exec(); 
    },
    delete: async(id) => {
        const post = await forumModel.findByIdAndRemove(id).exec();
        return `Deleted Topic/Comment - ${post._id}`
    }
}