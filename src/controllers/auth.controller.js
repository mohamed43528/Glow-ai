// src/controllers/auth.controller.js

export const register = async (req, res) => {
  return res.json({ message: "Register controller working" });
};

export const login = async (req, res) => {
  return res.json({ message: "Login controller working" });
};
// src/controllers/auth.controller.js

import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = new Clerk({ secretKey: process.env.CLERK_KEY });

// REGISTER
export const register = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    const user = await clerk.users.createUser({ email, password, phone });

    return res.status(201).json({ message: "User registered", user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  return res.json({ message: "Login controller working" });
};
