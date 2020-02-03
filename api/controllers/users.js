const usersModel = require('../models/users');
const bcrypt = require('bcrypt');
const  { excractFields, getDefaultQueryParams } = require('../helpers/general');
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')

module.exports = userController = {
    
    registerAdmin: async (params, installation) => {
        
        if(installation){
            const countAdmins = await usersModel.count({role: 'admin'}).exec();
            if(countAdmins > 0) throw new ErrorWithStatusCode('Account already exists', 502)
        }
        
        return await userController.create(params);
    },
    create: async (params) => {
        params = { username, password, email, role } = params;

        if (params.password) {
            params.password = bcrypt.hashSync(params.password, parseInt(process.env.SALT_ROUNDS));
        } 
       
        return await usersModel.create(params);
    },
    find: async (qParams = {}) => {
  
        qParams = getDefaultQueryParams(qParams);
        const users = await usersModel.find({}, { password: 0, __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(users).map(user => {
            return excractFields(user, qParams.fields);
        })
    },  
}