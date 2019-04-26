import express from 'express';
import bodyParser from 'body-parser';



let getRoutes = express();
const router = express.Router();


// server.set('superSecret', config.secret);

// router.use();
// router.use('', jwtverify);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));


import {userRouter} from '../controllers/userRoutes';
import {AuthController} from '../controllers/authentication';
import {staffRouter} from '../controllers/staffRoute';
import  {adminRouter} from '../controllers/adminRoute';
import {generalRoute} from '../controllers/generalRoute.js';


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

export {getRoutes}