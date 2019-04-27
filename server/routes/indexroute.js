import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './userRoutes';
import { AuthController } from './authenticationRoute';
import { staffRouter } from './staffRoute';
import { adminRouter } from './adminRoute';
import { generalRoute } from './generalRoute';


const getRoutes = express();
getRoutes.use(bodyParser.urlencoded({ extended: false }));

getRoutes.use(express.json());

// All user ROUTES
getRoutes.use('/api/v1/', userRouter);

// All Authentication Route
getRoutes.use('/api/v1/', AuthController);

// All staff Route
getRoutes.use('/api/v1/', staffRouter);

// All admin only route
getRoutes.use('/api/v1/', adminRouter);

// General Auth
getRoutes.use('/api/v1/', generalRoute);

export { getRoutes };
