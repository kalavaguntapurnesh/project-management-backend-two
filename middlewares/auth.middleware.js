const JWT = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    JWT.verify(token, process.env.KEY, (error, decode) => {
      if (error) {
        return res.json({ message: "Auth Failed" });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Authentication Failed in catch block" });
  }
};

module.exports = authMiddleware;
