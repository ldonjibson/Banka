import express from 'express';
import jwt from 'jsonwebtoken';

import { pool } from '../db/index';

import * as config from '../config/config';// used to create, sign, and verify tokens

const db = pool;

const server = express();

server.set('superSecret', config.secret);

// route midleware to verify atoken

const jwtVerify = ((req, res, next) => {
  // check header or url parameters or post parameteers for token
  const token = req.body.token
  || req.query.token || req.headers['x-access-token'] || req.headers['bearerAuth'];
  // decode token
  if (token) {
    // verifies secret and check up
    jwt.verify(token, server.get('superSecret'), (err, decoded) => {
      if (err) {
        return res.json({
          status: 403,
          error: 'Failed to Authenticate token',
        });
      }
      // if authenticatable save to request for other route to use
      req.decoded = decoded;
      db.query('SELECT * FROM users WHERE email = $1 AND id = $2',
        [decoded.email, decoded.id], (error, response) => {
          if (error) {
            res.status(400).json({
              status: 400,
              error,
            });
          } else if (response.rows.length === 0) {
            res.status(404).json({
              status: 404,
              error: 'User does not exist',
            });
          } else {
            next();
          }
        });
    });
  } else {
    // if there is no token return an error
    return res.status(401).json({
      status: 401,
      error: 'No token provided.',
    });
  }
});

export { jwtVerify };
