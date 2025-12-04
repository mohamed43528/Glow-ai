import { prisma } from "../lib/prismaClient.js";
import { addMinutes } from "../utils/time.js";
import { aiSuggestTimes } from "../services/aiScheduler.js";

export const getAvailability = async (req, res) => {
  try {
    const { businessSlug, serviceId, staffId, date } = req.query;

    if (!businessSlug || !serviceId || !date)
      return res.status(400).json({ error: "Missing required query params" });

    const business = await prisma.business.findUnique({
      where: { slug: businessSlug }
    });
    if (!business) return res.status(404).json({ error: "Business not found" });

    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });
    if (!service) return res.status(404).json({ error: "Service not found" });

    const aiSuggestions = await aiSuggestTimes(
      business.id,
      date,
      service.duration
    );

    return res.json({
      availability: [],
      aiSuggestions
    });
  } catch (err) {
    console.error("getAvailability error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { businessSlug, serviceId, staffId, customer, startTime } = req.body;

    if (!businessSlug || !serviceId || !customer || !startTime)
      return res.status(400).json({ error: "Missing fields" });

    const business = await prisma.business.findUnique({
      where: { slug: businessSlug }
    });
    if (!business) return res.status(404).json({ error: "Business not found" });

    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });
    if (!service) return res.status(404).json({ error: "Service not found" });

    const start = new Date(startTime);
    const end = addMinutes(start, service.duration);

    const conflict = await prisma.booking.findFirst({
      where: {
        businessId: business.id,
        staffId,
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } }
        ]
      }
    });

    if (conflict)
      return res.status(400).json({ error: "Time slot unavailable" });

    let customerRecord = await prisma.customer.findFirst({
      where: { email: customer.email, businessId: business.id }
    });

    if (!customerRecord) {
      customerRecord = await prisma.customer.create({
        data: {
          email: customer.email,
          phone: customer.phone,
          businessId: business.id
        }
      });
    }

    const booking = await prisma.booking.create({
      data: {
        businessId: business.id,
        customerId: customerRecord.id,
        staffId,
        serviceId,
        startTime: start,
        endTime: end
      }
    });

    return res.json({ success: true, booking });
  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const rescheduleBooking = async (req, res) => {
  try {
    const { bookingId, newStart } = req.body;

    if (!bookingId || !newStart)
      return res.status(400).json({ error: "Missing fields" });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const duration =
      (new Date(booking.endTime).getTime() -
        new Date(booking.startTime).getTime()) /
      60000;

    const start = new Date(newStart);
    const end = addMinutes(start, duration);

    const conflict = await prisma.booking.findFirst({
      where: {
        businessId: booking.businessId,
        staffId: booking.staffId,
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } }
        ]
      }
    });

    if (conflict)
      return res.status(400).json({ error: "New time unavailable" });

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { startTime: start, endTime: end }
    });

    return res.json({ success: true, booking: updated });
  } catch (err) {
    console.error("rescheduleBooking error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId)
      return res.status(400).json({ error: "Missing bookingId" });

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "cancelled" }
    });

    return res.json({ success: true, booking });
  } catch (err) {
    console.error("cancelBooking error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
