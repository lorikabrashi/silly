const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const jwt = require('jsonwebtoken');

const getTokenFromHeader = (req) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];        
    if (!token) {
        throw new ErrorWithStatusCode('Auth token is not supplied', 400);
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    return token;
}

const validateTokenExp = (req, next, key, role) => {

    const token = getTokenFromHeader(req);

    jwt.verify(token, key, (err, decoded) => {
        if(err && err.name === 'TokenExpiredError'){
            decoded = jwt.decode(token, key);
            if(decoded.role !== role) throw new ErrorWithStatusCode('Token is not valid', 401);
            req.decoded = decoded;
            next();
        }
        else { 
            throw new ErrorWithStatusCode('Token hasn\'t expire yet', 401);
        }
    });
}

const validateToken = (req, next, key, role) => {

    const token = getTokenFromHeader(req);      

    jwt.verify(token, key, (err, decoded) => {   
        if(err) throw new ErrorWithStatusCode('Token is not valid', 401);
        if(decoded.role !== role) throw new ErrorWithStatusCode('Token is not valid', 401);
        req.decoded = decoded;
        next();
    });
};

module.exports = {             
    adm : {
        validateAccessTokenExp: (req, res, next) => {
            validateTokenExp(req, next, process.env.JWT_KEY_ACCESS_TOKEN, 'admin');
        },
        validateAccessToken: (req, res, next) => {
            validateToken(req, next, process.env.JWT_KEY_ACCESS_TOKEN, 'admin');
        },
    },
    app: {
        validateAccessTokenExp: (req, res, next) => {
            validateTokenExp(req, next, process.env.JWT_KEY_ACCESS_TOKEN, 'user');
        },
        validateAccessToken: (req, res, next) => {
            validateToken(req, next, process.env.JWT_KEY_ACCESS_TOKEN, 'user');
        },
    }
}