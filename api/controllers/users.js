const usersModel = require('../models/user');
const profilesModel = require('../models/profile');
const { excractFields, getDefaultQueryParams } = require('../helpers/general');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const validations = require('../helpers/validations')
const mailConfig = require('../helpers/mailConfig');
const nodemailer = require('nodemailer');

module.exports = userController = {
    resetPassword: async (params, token) => {
        const password = bcrypt.hashSync(params.password, parseInt(process.env.SALT_ROUNDS));
        const decoded = await new Promise( ( resolve, reject ) => { 
        jwt.verify(token, process.env.JWT_KEY_PASSWORD_RESET, (err, decoded) => {
            if(err){
                reject(err);
            }
            resolve(decoded)
        })
        }).catch(err => { throw new ErrorWithStatusCode(err.message, err.statusCode)});
        await usersModel.updateOne({ email: decoded.email }, { password });
        return
    },
    requestPasswordReset: async (params) => {
        const { email } = params;
        const user = await usersModel.findOne({ email }).exec();
        if(!user){
            throw new ErrorWithStatusCode("User witth this email doesn't exist", 404);
        }
        const JWT_data = { email };
        const token = jwt.sign(JWT_data, process.env.JWT_KEY_PASSWORD_RESET, { expiresIn: process.env.JWT_KEY_PASSWORD_RESET_EXP });
        const smtpTrans = nodemailer.createTransport(mailConfig.config)
        await smtpTrans.sendMail(mailConfig.templates.resetPassword(user.username, email, token));
        return
    },
    verifyUser: async (token) => {
        const decoded = await new Promise( ( resolve, reject ) => { 
            jwt.verify(token, process.env.JWT_KEY_VERIFICATION, (err, decoded) => {
                if(err){
                    reject(err);
                }
                resolve(decoded)
            })
        }).catch(err => { throw new ErrorWithStatusCode(err.message, err.statusCode)});

        const user = await usersModel.findOne({email: decoded.email}).exec();
        if(!user){
            throw new ErrorWithStatusCode("User with this email doesn't exist", 404)
        }
        if(user.verified){
            throw new ErrorWithStatusCode("User already verified", 400)
        }
        await usersModel.updateOne({ _id: user._id }, { verified: true }).exec();
        return
    },
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
        params.role = 'admin';
        params.verified = true;
        return await userController.create(params);
    },

    register: async (params) => {
        params = { username, password, email } = params;
        
        params.role = 'user';
        params.verified = false;
        
        if (params.password) {
            params.password = bcrypt.hashSync(params.password, parseInt(process.env.SALT_ROUNDS));
        }
        
        const JWT_data = { email };
        const verification_token = jwt.sign(JWT_data, process.env.JWT_KEY_VERIFICATION, { expiresIn: process.env.JWT_KEY_VERIFICATION_EXP });
        const smtpTrans =  nodemailer.createTransport(mailConfig.config)
        await smtpTrans.sendMail(mailConfig.templates.verification(username, email, verification_token));

        const user = await usersModel.create(params)
        return `Created user - ${user._id}`
    
    },

    create: async (params) => {
        
        params = { username, password, email, role } = params;
        params.verified = true;
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