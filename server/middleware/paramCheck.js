
// route midleware to verify if parameter passed is a number

const paramChecks = ((req, res, next) => {
  // check header or url parameters or post parameteers for token
  const number = req.params.id || req.params.accountNumber;
  if (isNaN(number)) {
    // verifies if the parameter passed is a number
    return res.status(400).json({
      status: 400,
      error: 'Invalid Parameters',
    });
  }
  next();
});

export const pChecks = paramChecks;
