const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.SECRET_KEY, {
    expiresIn: "2h",
  });
};

const verifyToken = (token) => jwt.verify(token, process.env.SECRET_KEY);

module.exports = { generateToken, verifyToken };
