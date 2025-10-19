import express from "express";
import prisma from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get all equipment
router.get("/", authMiddleware, async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany({
      include: { maintenanceLogs: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get equipment by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: Number(req.params.id) },
      include: { maintenanceLogs: { include: { performedBy: true } } },
    });
    if (!equipment)
      return res.status(404).json({ error: "Equipment not found" });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new equipment (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Only admins can add equipment" });

    const { name, type, location, nextMaintenance } = req.body;
    const equipment = await prisma.equipment.create({
      data: {
        name,
        type,
        location,
        nextMaintenance: new Date(nextMaintenance),
      },
    });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update equipment (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ error: "Only admins can update equipment" });

    const { name, type, location, nextMaintenance } = req.body;
    const updated = await prisma.equipment.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        type,
        location,
        nextMaintenance: new Date(nextMaintenance),
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete equipment (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ error: "Only admins can delete equipment" });

    await prisma.maintenanceLog.deleteMany({
      where: { equipmentId: Number(req.params.id) },
    });
    await prisma.equipment.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
