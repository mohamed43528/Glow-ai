import prisma from "../prismaClient.js";

/**
 * Returns the BusinessSettings object for the authenticated business.
 * req.business must be set by authBusiness middleware { businessId }
 */
export const getSettings = async (req, res) => {
  try {
    const { businessId } = req.business;
    const settings = await prisma.businessSettings.findUnique({ where: { businessId } });
    return res.json({ settings });
  } catch (err) {
    console.error("getSettings error:", err);
    return res.status(500).json({ error: "Failed to fetch settings" });
  }
};

/**
 * Upserts (create or update) the BusinessSettings record for the business.
 */
export const updateSettings = async (req, res) => {
  try {
    const { businessId } = req.business;
    const data = req.body || {};

    const updated = await prisma.businessSettings.upsert({
      where: { businessId },
      create: { businessId, ...data },
      update: data
    });

    return res.json({ settings: updated });
  } catch (err) {
    console.error("updateSettings error:", err);
    return res.status(500).json({ error: "Failed to update settings" });
  }
};
