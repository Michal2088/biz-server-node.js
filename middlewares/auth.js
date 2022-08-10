const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied,no token provided");
  try {
    req.payload=jwt.verify(token,process.env.secretKey) 
    next()
  } catch (error) {
    res.status(401).send("Invalid tokens"); 
  }
};
