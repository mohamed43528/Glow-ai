import prisma from "../prismaClient.js";
import { stripe } from "../config/stripe.js";

/**
 * Get saved cards for the authenticated customer
 */
export const getCustomerCards = async (req, res) => {
  try {
    const { customerId } = req.user;

    const cards = await prisma.card.findMany({
      where: { customerId }
    });

    return res.json({ cards });
  } catch (err) {
    console.error("getCustomerCards error:", err);
    return res.status(500).json({ error: "Failed to fetch cards" });
  }
};

/**
 * Add a new card (Stripe PaymentMethod + local record)
 */
export const addCustomerCard = async (req, res) => {
  try {
    const { customerId } = req.user;
    const { paymentMethodId } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({ error: "paymentMethodId required" });
    }

    // Fetch the customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Create Stripe customer if missing
    let stripeCustomerId = customer.stripeId;

    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: customer.email
      });

      stripeCustomerId = stripeCustomer.id;

      await prisma.customer.update({
        where: { id: customerId },
        data: { stripeId: stripeCustomerId }
      });
    }

    // Attach payment method to Stripe customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId
    });

    // Save to local DB
    const card = await prisma.card.create({
      data: { customerId, stripePM: paymentMethodId }
    });

    const cards = await prisma.card.findMany({ where: { customerId } });

    return res.json({ success: true, card, cards });
  } catch (err) {
    console.error("addCustomerCard error:", err);
    return res.status(500).json({ error: "Failed to add card" });
  }
};

/**
 * Delete card (local + Stripe detach)
 */
export const deleteCustomerCard = async (req, res) => {
  try {
    const { cardId } = req.body;

    if (!cardId) {
      return res.status(400).json({ error: "cardId required" });
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Attempt to detach from Stripe (best-effort)
    try {
      await stripe.paymentMethods.detach(card.stripePM);
    } catch (err) {
      console.warn("Stripe detach error (ignored):", err.message || err);
    }

    await prisma.card.delete({
      where: { id: cardId }
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("deleteCustomerCard error:", err);
    return res.status(500).json({ error: "Failed to delete card" });
  }
};
