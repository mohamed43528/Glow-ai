import { PrismaClient } from "@prisma/client"; const prisma = new PrismaClient();

export const getSettings = async (req, res) => { const { businessId } = req.business; const settings = await prisma.businessSettings.findUnique({ where: { businessId } }); res.json({ settings }); };

export const updateSettings = async (req, res) => { const { businessId } = req.business; const data = req.body;

const updated = await prisma.businessSettings.upsert({ where: { businessId }, create: { businessId, ...data }, update: data });

res.json({ settings: updated }); };
