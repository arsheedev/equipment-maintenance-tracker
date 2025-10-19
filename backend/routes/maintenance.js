import express from "express";
import prisma from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Create maintenance log
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { equipmentId, description, cost } = req.body;
    const log = await prisma.maintenanceLog.create({
      data: {
        equipmentId: Number(equipmentId),
        performedById: req.user.id,
        description,
        cost: cost ? parseFloat(cost) : null,
      },
    });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all logs (Admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Only admins can view all logs" });

    const logs = await prisma.maintenanceLog.findMany({
      include: {
        equipment: true,
        performedBy: { select: { name: true, email: true } },
      },
      orderBy: { date: "desc" },
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single maintenance log by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        equipment: { select: { id: true, name: true } },
        performedBy: { select: { id: true, name: true, email: true } },
      },
    });
    if (!log)
      return res.status(404).json({ error: "Maintenance log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get logs for specific equipment
router.get("/equipment/:id", authMiddleware, async (req, res) => {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      where: { equipmentId: Number(req.params.id) },
      include: { performedBy: true },
      orderBy: { date: "desc" },
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update maintenance log
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!log) return res.status(404).json({ error: "Log not found" });

    if (req.user.role !== "admin" && req.user.id !== log.performedById) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { description, cost } = req.body;
    const updated = await prisma.maintenanceLog.update({
      where: { id: log.id },
      data: { description, cost: cost ? parseFloat(cost) : null },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete maintenance log
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!log) return res.status(404).json({ error: "Log not found" });

    if (req.user.role !== "admin" && req.user.id !== log.performedById) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.maintenanceLog.delete({ where: { id: log.id } });
    res.json({ message: "Maintenance log deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
