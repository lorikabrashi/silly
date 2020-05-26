const categoryModel = require('../models/category')
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const { excractFields, getDefaultQueryParams, getBoolean } = require('../helpers/general');

module.exports = categoriesController = {
    generateElem: (data, level) => {
        let lines = '';
        for (let i = 0; i < level; i++) {
            lines += " - ";
        }
        const newElem = Object.assign({}, data._doc);
        newElem.name = `${lines}${newElem.name}`;
        newElem.level = level
        delete newElem.children
        delete newElem.parent
        return newElem;
    },
    orderCategories: (data, list, level) => {
        data.forEach(elem => {
            if(!elem.children.length){
                list.push(categoriesController.generateElem(elem, level));
            }
            else{
                list.push(categoriesController.generateElem(elem, level));
                level++;
                categoriesController.orderCategories(elem.children, list, level);
                level--;
            }
        })
    },
    getCategories: async (order, qParams) => {
        order = getBoolean(order)
        let query = {}
        if(order){
            query = { parent: null };
        }
        qParams = getDefaultQueryParams(qParams);
        let categories = await categoryModel.find(query, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });
        
        if(order){
            let list = []
            categoriesController.orderCategories(categories, list, 0)
            //console.log(list);
            categories = list;
        }
        return Array.from(categories).map(category => {
            return excractFields(category, qParams.fields);
        })
    },
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
        if(category.children && category.children.length !== 0){
            const ids = [];
            category.children.forEach(elem => {
                ids.push(elem._id)
            });
            if(category.parent){
               await categoryModel.update({ _id: category.parent }, { $push: { children: ids } }).exec();
            }
            else{
                await categoryModel.updateMany({ _id: ids }, { parent: null })
            }
        }
        await categoryModel.findByIdAndRemove(id).exec();
        return `Deleted category - ${category._id}`
    }
}