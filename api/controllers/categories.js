const categoryModel = require('../models/category')
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const { excractFields, getDefaultQueryParams } = require('../helpers/general');

module.exports = categoriesController = {
    create: async (params) => {
        params = { name, description, parent } = params;
        const category = await categoryModel.create(params)
        if(parent){
            await categoryModel.update({_id: parent }, { $push: { children: [category._id] } }).exec();
        }
        return `Created category - ${category._id}`
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const categories = await categoryModel.find({}, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(categories).map(category => {
            return excractFields(category, qParams.fields);
        })
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const category = await categoryModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });
        return excractFields(category, qParams.fields);
    },
    update: async(id, params) => {
        
        params = { name, description, parent } = params;
        
        const category = await categoryModel.findById(id).exec();

        if(parent && parent !== category.parent){
            
            await categoryModel.update({ _id: category.parent }, { $pull: { children: { $in: [category._id] } } }).exec();
            await categoryModel.update({ _id: parent }, { $push: { children: [category._id] } }).exec();
        }
        return await categoryModel.findByIdAndUpdate(id, params, { new: true }).select('-__v').exec(); 
    },
    delete: async(id) => {
        
        const category = await categoryModel.findById(id).exec();
       
        if(category.parent){
            await categoryModel.update({ _id: category.parent }, { $pull: { children: { $in: [category._id] } } }).exec();    
        }
        if(category.children && category.children.length !== 0  && category.parent){

            const ids = [];
            category.children.forEach(elem => {
                ids.push(elem._id)
            });
            await categoryModel.update({ _id: category.parent }, { $push: { children: ids } }).exec();
            
        }
        await categoryModel.findByIdAndRemove(id).exec();
        return `Deleted category - ${category._id}`
    }
}