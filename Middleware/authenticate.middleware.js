const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    jwt.verify(token, "masai", function (err, decoded) {
      if (decoded) {
        req.body.userID = decoded.userID;
        next();
      } else {
        res.send({ msg: "Please Login First" });
      }
    });
  } catch (error) {
    res.send({ msg: "Please Login First" });
  }
};

module.exports = { authenticate };
