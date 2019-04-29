import express from 'express';

const noRoute = express.Router();


noRoute.post('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
  });
});

noRoute.patch('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
  });
});

noRoute.delete('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
  });
});

noRoute.put('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
  });
});

export { noRoute };
