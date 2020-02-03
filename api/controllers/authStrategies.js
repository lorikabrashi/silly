const usersModel = require('../models/users');
const bcrypt = require('bcrypt');
const  { excractFields, getDefaultQueryParams } = require('../helpers/general');
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')

module.exports = authStrategies = { 
    
    login: async (params) => {
        const { username, password, email } = params;
        let data = {};

        if (email.length > 0 && password.length > 0) {
            data = { email: email };
        }
        else if(username.length > 0 && password.length > 0) {
            data = { username: username };
        }
        else throw new ErrorWithStatusCode('Please provide username/email and a password', 400);

        let user = await usersModel.findOne(data).exec();
        if(!user){
            throw new ErrorWithStatusCode('Invalid username/email', 400);
        }
        const match = await bcrypt.compare(params.password, user.password);
        
        if(!match){
            throw new ErrorWithStatusCode('Incorrect password', 400);
        }
        
        //todo sign refresh token and access token and store the refresh token into redis

        return { ...excractFields(user, ['_id', 'username', 'email' ]), refreshToken: '', accessToken:'' };
        
    }   
}