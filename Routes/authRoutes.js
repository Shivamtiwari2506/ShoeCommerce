import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Refresh Access Token
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log('refreshToken', refreshToken);
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token found" });

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    const accessToken = jwt.sign(
      { id: decoded?.id, email: decoded?.email },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );

    return res.status(200).json({ accessToken });
  });
});

export default router;
