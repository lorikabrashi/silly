const usersModel = require('../models/user');
const bcrypt = require('bcrypt');
const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const jwt = require('jsonwebtoken');
const { extractFields } = require('../helpers/general');
const redis = require('redis');


const redisAddToList = async (key, value) => {
    const redisClient = redis.createClient(process.env.REDIS_PORT);
    const redisVal = await new Promise( ( resolve, reject ) => { 
        redisClient.lpush(key, value, (err, val) => {
            if(err) reject(err);
            resolve(val);
        });
    })
    .catch(err => { throw new ErrorWithStatusCode(err.message, 500) } )
    .finally(() => { redisClient.quit(); })
    
    return redisVal;
}

const redisRemoveFromList = async (key, value) => {
    const redisClient = redis.createClient(process.env.REDIS_PORT);
    const redisVal = await new Promise( ( resolve, reject ) => {
        redisClient.lrem(key, 0, value, (err, val) => {             
            if(err) reject(err);
            resolve(val);
        });
    })
    .catch( err => { throw new ErrorWithStatusCode(err.message, 500) })
    .finally(() => { redisClient.quit(); })

    return redisVal;
} 


module.exports = authStrategies = { 
    
    generateNewAccessToken: async (user, refreshToken) => {
    
        const redisClient = redis.createClient(process.env.REDIS_PORT);  
        await new Promise( ( resolve, reject ) => { 
            redisClient.lrange(user._id, 0, 10000, (err, val) => {
                if(err) reject(err);
                if(val.length === 0) reject( { message: 'Invalid Refresh Token', statusCode: 401 } )
                if(!val.includes(refreshToken)) reject( { message: 'Invalid Refresh Token', statusCode: 401 } )
                
                jwt.verify(refreshToken, process.env.JWT_KEY_REFRESH_TOKEN, (err, decoded) => {
                    if(err) reject(err);
                    resolve(refreshToken)
                });
            })
        })
        .catch(err => { throw new ErrorWithStatusCode(err.message, err.statusCode) })
        .finally(() => { redisClient.quit(); })

        await redisRemoveFromList(user._id, refreshToken);

        const tokenData = { 
            _id: user._id, 
            role: user.role 
        };
        const accessToken = jwt.sign(tokenData, process.env.JWT_KEY_ACCESS_TOKEN, { expiresIn: process.env.JWT_KEY_ACCESS_TOKEN_EXP });
        const newRefreshToken = jwt.sign(tokenData, process.env.JWT_KEY_REFRESH_TOKEN, { expiresIn: process.env.JWT_KEY_REFRESH_TOKEN_EXP });

        await redisAddToList(user._id.toString(), newRefreshToken);
        
        const userData = await usersModel.findOne({_id: user._id}).exec()
        return { user: { ...extractFields(userData, ['_id', 'username', 'email' ]) },  refreshToken: newRefreshToken, accessToken };
    },

    login: async (params) => {
        
        const { username, password, email, type } = params;
        const data = {};
        
        // "type" can be admin/user depending on the front app 
        if(!type) throw new ErrorWithStatusCode('Please provide the platform', 400);
        data.role = type;

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

        const accessToken = jwt.sign(tokenData, process.env.JWT_KEY_ACCESS_TOKEN, { expiresIn: process.env.JWT_KEY_ACCESS_TOKEN_EXP });
        const refreshToken = jwt.sign(tokenData, process.env.JWT_KEY_REFRESH_TOKEN, { expiresIn: process.env.JWT_KEY_REFRESH_TOKEN_EXP });

        redisAddToList(user._id.toString(), refreshToken);

        return { user: { ...extractFields(user, ['_id', 'username', 'email' ]) }, refreshToken, accessToken };
    },

    logout: async (_id, refreshToken) => {
        const val = await redisRemoveFromList(_id, refreshToken);
        return val;
    }
}