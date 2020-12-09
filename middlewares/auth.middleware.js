const jwt = require('jsonwebtoken');

exports.authGuard = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    return next();
  } catch (error) {
    console.log(error);

    return res.sendStatus(403);
  }
};
