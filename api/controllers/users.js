const usersModel = require('../models/users');
const profilesModel = require('../models/profiles');

const bcrypt = require('bcrypt');
const { excractFields, getDefaultQueryParams } = require('../helpers/general');
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const validations = require('../helpers/validations')


module.exports = userController = {
    
    updateProfile: async(id, params) => {
        params = { first_name, last_name, image, phone_number } = params;
        const user = await usersModel.findById(id).exec();
        if('profile' in user._doc){
            const profileID = user.profile;
            await profilesModel.update({_id: profileID }, params ).exec();
        }
        else{
            const profile = await profilesModel.create(params);
            await usersModel.update({_id: id }, { profile: profile._id } ).exec();
        }
        
        return await userController.findById(id);
    },
    
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
        
        const user = await usersModel.create(params)
        return `Created user - ${user._id}`
    
    },

    find: async (qParams = {}) => {
  
        qParams = getDefaultQueryParams(qParams);
        const users = await usersModel.find({}, { password: 0, __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(users).map(user => {
            return excractFields(user, qParams.fields);
        })
    },

    findById: async (id, qParams = {}) => {
  
        qParams = getDefaultQueryParams(qParams);
        const user = await usersModel.findById(id, { password: 0, __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return excractFields(user, qParams.fields);        
    },

    update: async(id, params) => {
        params = { username, password, email, role } = params;
        
        if (params.password) {
            validations.validatePassword(params.password);
            params.password = bcrypt.hashSync(params.password, parseInt(process.env.SALT_ROUNDS));
        }

        return await usersModel.findByIdAndUpdate(id, params, { new: true }).select('-password').select('-__v').exec(); 
         
    },

    delete: async(id) => {
        const user = await usersModel.findByIdAndRemove(id).exec();
        return `Deleted user - ${user._id}`
    } 
}