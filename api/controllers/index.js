const usersController = require('./users');
const authStrategies = require('./authStrategies');
const licenseController = require('./licenses')
const categoryController = require('./categories');
const permissionsController = require('./permissions');
const forumController = require('./forum');
const positionController = require('./position');
const projectController = require('./project')

module.exports = {
	users: usersController,
    auth: authStrategies,
    licenses: licenseController,
    categories: categoryController,
    permissions: permissionsController,
    forum: forumController,
    positions: positionController,
    projects: projectController
};