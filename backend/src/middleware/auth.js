import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Auth required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      customerId: decoded.customerId,
      businessId: decoded.businessId
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
