// src/controllers/health.controller.js

export const getHealth = async (req, res) => {
  try {
    return res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Health check error:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
