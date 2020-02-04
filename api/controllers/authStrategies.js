const usersModel = require('../models/users');
const bcrypt = require('bcrypt');
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const jwt = require('jsonwebtoken');
const { excractFields } = require('../helpers/general');
const redis = require('redis');

module.exports = authStrategies = { 
    
    generateNewAccessToken: async (user) => {
        const tokenData = { 
            _id: user._id, 
            role: user.role 
        };
        const accessToken = jwt.sign(tokenData, process.env.JWT_KEY_ACCESS_TOKEN, { expiresIn: '1h' });
        return { accessToken };
    },
    login: async (params) => {
        
        const { username, password, email } = params;
        const data = {};

        if ( (email && password) && email.length > 0 && password.length > 0) {
            data.email = email;
        }
        else if((username && password) && username.length > 0 && password.length > 0) {
            data.username = username;
        }
        else throw new ErrorWithStatusCode('Please provide username/email and a password', 400);

        const user = await usersModel.findOne(data).exec();
        if(!user){
            throw new ErrorWithStatusCode('Invalid username/email', 400);
        }
        const match = await bcrypt.compare(params.password, user.password);
        
        if(!match){
            throw new ErrorWithStatusCode('Incorrect password', 400);
        }

        const tokenData = { 
            _id: user._id, 
            role: user.role 
        };

        const refreshToken = jwt.sign(tokenData, process.env.JWT_KEY_REFRESH_TOKEN, { expiresIn: '5d' });
        const accessToken = jwt.sign(tokenData, process.env.JWT_KEY_ACCESS_TOKEN, { expiresIn: '1h' });

        const redisClient = redis.createClient(process.env.REDIS_PORT);
        redisClient.setex(user._id.toString(), 432000, refreshToken);
        redisClient.quit();

        return { ...excractFields(user, ['_id', 'username', 'email' ]), refreshToken, accessToken };
    },   
    logout: async (_id) => {
        const redisClient = redis.createClient(process.env.REDIS_PORT);
        const val = await new Promise( ( resolve ) => {
            redisClient.del(_id, (err, val) => {                
                resolve(val);
            });
        })
        redisClient.quit();
        return val;
    }
}