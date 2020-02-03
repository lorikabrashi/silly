const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const cors = require('cors');
const generalHelpers = require('./helpers/general');

const exposedRoutes = require('./routes/v1/exposed/')
const adminRoutes = require('./routes/v1/adm/'); 
const appRoutes = require('./routes/v1/app/');

const app = express();

/**
 * 
 * Staring redis client
 */
//const redis = require('redis');
//const redisC = redis.createClient(process.env.REDIS_PORT);
//redisC.set('someTest', 'lorik');

/* create startup folders */
generalHelpers.createFolder('./logs');
generalHelpers.createFolder('./public/uploads');

/* create log files */
generalHelpers.generateLogFile(app, './logs/stderr.log', 'errors' );
generalHelpers.generateLogFile(app, './logs/stdout.log', 'others' );

app.use(cors())
app.use((req, res, next) =>{

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');	
	next();
	
});

// handle request body.req
app.use(bodyParser.json());

// handle put/delete requests in forms
app.use(methodOverride('_method'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/', exposedRoutes);
app.use('/api/v1/adm', adminRoutes);
app.use('/api/v1/app', appRoutes);

app.use((error, req, res, next) => {
    /* console.log(error); */
    res.status(error.statusCode || 500).json({
        confirmation: 'Fail',
        statusCode: error.statusCode || 500,
        message: error.message
    });
});

module.exports = app;
