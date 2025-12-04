// backend/src/controllers/customer.controller.js
import { prisma } from "../lib/prismaClient.js";
import { stripe } from "../config/stripe.js";

export const getCustomerCards = async (req, res) => {
  try {
    const { customerId } = req.user;
    const cards = await prisma.card.findMany({ where: { customerId } });
    return res.json({ cards });
  } catch (err) {
    console.error("getCustomerCards error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addCustomerCard = async (req, res) => {
  try {
    const { customerId } = req.user;
    const { paymentMethodId } = req.body;
    if (!paymentMethodId) return res.status(400).json({ error: "paymentMethodId required" });

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    if (!customer.stripeId) {
      const stripeCustomer = await stripe.customers.create({ email: customer.email });
      await prisma.customer.update({ where: { id: customerId }, data: { stripeId: stripeCustomer.id } });
      customer.stripeId = stripeCustomer.id;
    }

    await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.stripeId });
    await prisma.card.create({ data: { customerId, stripePM: paymentMethodId } });

    return res.json({ success: true });
  } catch (err) {
    console.error("addCustomerCard error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCustomerCard = async (req, res) => {
  try {
    const { cardId } = req.body;
    if (!cardId) return res.status(400).json({ error: "cardId required" });

    await prisma.card.delete({ where: { id: cardId } });
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteCustomerCard error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
