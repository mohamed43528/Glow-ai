import { PrismaClient } from "@prisma/client";
import { stripe } from "../config/stripe.js";

const prisma = new PrismaClient();

export const getCustomerCards = async (req, res) => {
  const { customerId } = req.user;

  const cards = await prisma.card.findMany({
    where: { customerId }
  });

  res.json({ cards });
};

export const addCustomerCard = async (req, res) => {
  const { customerId } = req.user;
  const { paymentMethodId } = req.body;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId }
  });

  if (!customer.stripeId) {
    const stripeCustomer = await stripe.customers.create({
      email: customer.email
    });

    await prisma.customer.update({
      where: { id: customerId },
      data: { stripeId: stripeCustomer.id }
    });
  }

  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customer.stripeId
  });

  await prisma.card.create({
    data: { customerId, stripePM: paymentMethodId }
  });

  res.json({ success: true });
};

export const deleteCustomerCard = async (req, res) => {
  const { cardId } = req.body;

  await prisma.card.delete({
    where: { id: cardId }
  });

  res.json({ success: true });
};
