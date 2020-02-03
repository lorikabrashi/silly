const usersController = require('./users');
const authStrategies = require('./authStrategies');
module.exports = {
	users: usersController,
    auth: authStrategies
};