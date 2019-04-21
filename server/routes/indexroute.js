const express = require('express')
let bodyParser = require('body-parser');



let getRoutes = express();
const router = express.Router();

let config = require('../config/config.js')

// server.set('superSecret', config.secret);

// router.use();
// router.use('', jwtverify);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));


const userRouter = require('../controllers/userRoutes.js');
const AuthController = require('../controllers/authentication.js');
const staffRouter = require('../controllers/staffRoute.js');
const adminRouter = require('../controllers/adminRoute.js');
// const bothAdminStaff = require('../controllers/bothAdminStaff.js');
// const bothAdStaf = require('../controllers/bothAdStaf.js');
const generalRoute = require('../controllers/generalRoute.js');


// All user ROUTES
getRoutes.use('/api/v1/', userRouter);

// All Authentication Route
getRoutes.use('/api/v1/', AuthController);

//All staff Route
getRoutes.use('/api/v1/', staffRouter);

//All admin only route
getRoutes.use('/api/v1/', adminRouter);

//General Auth
getRoutes.use('/api/v1/', generalRoute);

module.exports = getRoutes;