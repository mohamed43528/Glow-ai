import { resend } from "../config/resend.js";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";

export const sendMagicLink = async (req, res) => {
  try {
    const { email, businessSlug } = req.body;
    if (!email || !businessSlug) return res.status(400).json({ error: "Missing fields" });

    const business = await prisma.business.findUnique({ where: { slug: businessSlug } });
    if (!business) return res.status(404).json({ error: "Business not found" });

    const token = jwt.sign({ email, businessId: business.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const magicUrl = `${process.env.FRONTEND_URL}/login?token=${token}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@glowai.com",
      to: email,
      subject: "Your Glow AI Login Link",
      html: `<p>Log in: <a href="${magicUrl}">Click here</a></p>`
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("sendMagicLink error:", err);
    return res.status(500).json({ error: "Failed to send magic link" });
  }
};

export const verifyMagicLink = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, businessId } = decoded;

    let customer = await prisma.customer.findFirst({ where: { email, businessId } });

    if (!customer) {
      customer = await prisma.customer.create({ data: { email, businessId } });
    }

    const sessionToken = jwt.sign({ customerId: customer.id, businessId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token: sessionToken, customer });
  } catch (err) {
    console.error("verifyMagicLink error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
