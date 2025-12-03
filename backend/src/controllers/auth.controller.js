import { resend } from "../config/resend.js";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const sendMagicLink = async (req, res) => {
  const { email, businessSlug } = req.body;

  if (!email || !businessSlug)
    return res.status(400).json({ error: "Missing fields" });

  const business = await prisma.business.findUnique({
    where: { slug: businessSlug }
  });

  if (!business)
    return res.status(404).json({ error: "Business not found" });

  const token = jwt.sign(
    { email, businessId: business.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const magicUrl = `${process.env.FRONTEND_URL}/login?token=${token}`;

  await resend.emails.send({
    from: "Glow AI <auth@glowai.com>",
    to: email,
    subject: "Your Glow AI Login Link",
    html: `<p>Log in: <a href="${magicUrl}">Click here</a></p>`
  });

  res.json({ success: true });
};

export const verifyMagicLink = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, businessId } = decoded;

    let customer = await prisma.customer.findFirst({
      where: { email, businessId }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { email, businessId }
      });
    }

    const sessionToken = jwt.sign(
      { customerId: customer.id, businessId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token: sessionToken, customer });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
