const { verifyToken } = require("../utils/token");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Не авторизован!" });
    }

    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Не авторизован!" });
  }
};
