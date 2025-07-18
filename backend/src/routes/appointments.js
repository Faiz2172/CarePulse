import express from "express";
import { createAppointment, getAppointments, updateAppointment, deleteAppointment, getAppointmentById } from "../controllers/appointmentController.js";
const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;