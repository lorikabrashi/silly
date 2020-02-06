const fs = require('fs');
const logger = require('morgan');

module.exports = {
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

        const result = fields.reduce((acc, field) => {
            acc[field] = resource[field];
            return acc;
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