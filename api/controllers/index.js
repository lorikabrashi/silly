const usersController = require('./users');
const authStrategies = require('./authStrategies');
const licenseController = require('./licenses')
const categoryController = require('./categories');
module.exports = {
	users: usersController,
    auth: authStrategies,
    licenses: licenseController,
    categories: categoryController,

};