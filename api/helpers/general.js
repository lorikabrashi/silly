const fs = require('fs');
const logger = require('morgan');

const getInnerChildArray = (resource, fields, isLast, child = null) => {    
    const returnValuesArr = [];
    const resourceArr = JSON.parse(JSON.stringify(resource));
    if(Array.isArray(resourceArr)){
        resourceArr.forEach(elem => {
            if(isLast && elem[fields]){
                returnValuesArr.push({ [fields]: elem[fields] } )
            }
            else{
                if(elem[child]){
                    returnValuesArr.push( { [child]: getInnerChild(elem[child], fields, fields.length) } )
                }
            } 
        });
    }
    return returnValuesArr; 
}

const getInnerChild = (resource, fields, index) => {    
    if(index == 1){
        const returnValue = resource[fields]
        if(returnValue){
            return { [fields]: returnValue }
        }
        else{
            return getInnerChildArray(resource, fields, true);
        }
    }
    else{
        const child = fields.shift();
        if(resource[child]){
            return getInnerChild(resource[child], fields, fields.length);
        }
        else{
            return getInnerChildArray(resource, fields, false, child);
        }
    }
}

module.exports = helperFuncitons = {
    isEmptyObject: (obj) => {
		return !Object.keys(obj).length;
	},
    createFolder:(dir) => {
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
	},
    generateLogFile: (app, path, type) => {
        app.use(logger('common', {
            skip: function (req, res) {
                if(type === 'errors') return res.statusCode < 400
                else  return res.statusCode >= 400 
            }, 
            stream: fs.createWriteStream(path, { flags: 'a' })
        }));
    },
    excractFields: (resource, fields) => {
        if(fields.length < 1) return resource;
            const result = fields.reduce((newResource, field) => {
            if(field.includes('.')){
                const splitField = field.split(".");    
                newResource[field] = getInnerChild(resource, splitField, splitField.length)
            }
            else{
                newResource[field] = resource[field];
            }
            return newResource;
        }, {});

        return result;
    },
    getDefaultQueryParams: (params) => {
        let { offset, limit, fields } = params;

        offset = parseInt(offset);
        limit = parseInt(limit);
        limit = Math.min(limit, 50);
    
        offset = offset ? offset : 0;
        limit = limit ? limit : 50;
        fields = fields ? fields.split(",") : [];
        
        return { offset, limit, fields }
    },
    sendResponse: (results, confirmation = true) => {  
        if(!confirmation) 
            return { confirmation: 'Fail', statusCode: results.statusCode || 500, message: results.message };
        
        return { confirmation: 'Success', results };
    } 
}