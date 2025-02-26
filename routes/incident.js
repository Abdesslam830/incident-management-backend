const express = require("express");
const { Incident, User } = require("../models");
const { authMiddleware, isAdmin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @route GET /api/incidents
 * @desc Get all incidents (Admin only)
 */
router.get("/", authMiddleware, isAdmin, async (req, res, next) => {
  try {
    const incidents = await Incident.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]], // Show newest incidents first
    });

    res.json(incidents);
  } catch (err) {
    next(err); // Pass the error to the global error handler
  }
});

/**
 * @route GET /api/incidents/:id
 * @desc Get a single incident by ID
 */
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const incident = await Incident.findOne({
      where: { id },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    if (!incident) return res.status(404).json({ message: "Incident not found" });

    res.json(incident);
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /api/incidents
 * @desc Create a new incident (Only authenticated users)
 */
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { title, description, severity, status } = req.body;
    if (!title || !description || !severity || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const incident = await Incident.create({
      title,
      description,
      severity,
      status,
      userId: req.user.id, // Attach logged-in user
    });

    res.status(201).json({ message: "Incident created successfully", incident });
  } catch (err) {
    next(err);
  }
});

/**
 * @route PUT /api/incidents/:id
 * @desc Update an incident (Admin only)
 */
router.put("/:id", authMiddleware, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, severity, status } = req.body;

    const incident = await Incident.findByPk(id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    await incident.update({ title, description, severity, status });

    res.json({ message: "Incident updated successfully", incident });
  } catch (err) {
    next(err);
  }
});

/**
 * @route DELETE /api/incidents/:id
 * @desc Delete an incident (Admin only)
 */
router.delete("/:id", authMiddleware, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const incident = await Incident.findByPk(id);

    if (!incident) return res.status(404).json({ message: "Incident not found" });

    await incident.destroy();
    res.json({ message: "Incident deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
