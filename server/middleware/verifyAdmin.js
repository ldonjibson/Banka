import express from 'express';
import jwt from 'jsonwebtoken';

import { pool } from '../db/index';

import * as config from '../config/config';// used to create, sign, and verify tokens

const db = pool;

const server = express();

server.set('superSecret', config.secret);

// route midleware to verify atoken

const jwtAdminVerify = ((req, res, next) => {
  // check header or url parameters or post parameteers for token
  const token = req.body.token
  || req.query.token || req.headers['x-access-token'] ;
  // decode token
  if (token) {
    // verifies secret and check up
    jwt.verify(token, server.get('superSecret'), (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          error: 'Failed to Authenticate token',
        });
      }
      // if authenticatable save to request for other route to use
      req.decoded = decoded;
      // check if user email has staff property
      db.query('SELECT * FROM users WHERE email = $1 AND id = $2',
        [decoded.email, decoded.id])
        .then((response) => {
          const result = response.rows;
          if (result.length === 0) {
            res.status(404).json({
              status: 404,
              error: 'User does not exist',
            });
          } else if (result[0].type != 'staff'
            || result[0].isadmin != true) {
            res.status(401).json({
              status: 401,
              error: 'You are not an Admin',
            });
          } else if (result[0].type === 'staff'
            && result[0].isadmin === true) {
            next();
          }
        }).catch((error) => {
          res.status(400).json({
            status: 404,
            error,
          });
        });
    });
  } else {
    // if there is no token return an error
    return res.json({
      status: 400,
      error: 'No token provided.',
    });
  }
});


export { jwtAdminVerify };
