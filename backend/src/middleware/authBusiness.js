import jwt from "jsonwebtoken";

export const authBusiness = (req, res, next) => {
  const token = req.headers["x-business-auth"];

  if (!token)
    return res.status(401).json({ error: "Business auth required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.business = { businessId: decoded.businessId };

    next();
  } catch {
    res.status(401).json({ error: "Invalid business token" });
  }
};
