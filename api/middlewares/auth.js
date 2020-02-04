const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const jwt = require('jsonwebtoken');
const redis = require('redis');

const validateToken = (req, next, key, role, isRefreshToken = false) => {

    let token = req.headers['x-access-token'] || req.headers['authorization'];        
    if (!token) {
        throw new ErrorWithStatusCode('Auth token is not supplied', 400);
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, key, (err, decoded) => {

        if(err) throw new ErrorWithStatusCode('Token is not valid', 401);
        if(decoded.role !== role) throw new ErrorWithStatusCode('Token is not valid', 401);
        
        if(isRefreshToken){
            const redisClient = redis.createClient(process.env.REDIS_PORT);
            const getKey = new Promise((resolve, reject) => {
                redisClient.get(decoded._id, (err, value) => {
                    if(value !== token) reject({message: 'Refresh Token is not valid', statusCode: 401});  
                    resolve()
                });
            })
            getKey.catch(next);
            getKey.then(() => {
                redisClient.quit();
                req.decoded = decoded;
                next(); 
            })
        }
        else{
            req.decoded = decoded;
            next();
        }
    });
};

module.exports = {             
    adm : {
        validateRefreshToken: (req, res, next) => {
            validateToken(req, next, process.env.JWT_KEY_REFRESH_TOKEN, 'admin', true);
        },
        validateAccessToken: (req, res, next) => {
            validateToken(req, next, process.env.JWT_KEY_ACCESS_TOKEN, 'admin');
        },
    },
    app: {
        validateRefreshToken: (req, res, next) => {
            validateToken(req, next, process.env.JWT_KEY_REFRESH_TOKEN, 'user', true);
        },
        validateAccessToken: (req, res, next) => {
            validateToken(req, next, process.env.JWT_KEY_ACCESS_TOKEN, 'user');
        },
    }
}