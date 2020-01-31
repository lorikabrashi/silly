const fs = require('fs');
const logger = require('morgan');

module.exports = {
    isEmptyObject: function (obj) {
		return !Object.keys(obj).length;
	},
    createFolder: function(dir) {
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
	},
    generateLogFile: function(app, path, type){
        app.use(logger('common', {
            skip: function (req, res) {
                if(type === 'errors') return res.statusCode < 400
                else  return res.statusCode >= 400 
            }, 
            stream: fs.createWriteStream(path, { flags: 'a' })
        }));
    }
}