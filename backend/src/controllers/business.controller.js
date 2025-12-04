// backend/src/controllers/business.controller.js
import { prisma } from "../lib/prismaClient.js";

export const getSettings = async (req, res) => {
  try {
    const { businessId } = req.business;
    const settings = await prisma.businessSettings.findUnique({ where: { businessId } });
    return res.json({ settings });
  } catch (err) {
    console.error("getSettings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { businessId } = req.business;
    const data = req.body;

    const updated = await prisma.businessSettings.upsert({
      where: { businessId },
      create: { businessId, ...data },
      update: data,
    });

    return res.json({ settings: updated });
  } catch (err) {
    console.error("updateSettings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
