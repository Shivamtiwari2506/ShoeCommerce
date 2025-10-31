import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    let token = req.headers?.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    token = token.split(" ")[1];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized user" });
  }
};

export default auth;
