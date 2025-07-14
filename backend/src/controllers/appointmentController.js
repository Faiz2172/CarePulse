import { db } from "../config/database.js";
import { appointments } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const data = req.body;
    const [newAppointment] = await db.insert(appointments).values(data).returning();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const all = await db.select().from(appointments);
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await db
      .update(appointments)
      .set(data)
      .where(eq(appointments.id, Number(id)))
      .returning();
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db
      .delete(appointments)
      .where(eq(appointments.id, Number(id)))
      .returning();
    if (deleted.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted', appointment: deleted[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.select().from(appointments).where(eq(appointments.id, Number(id)));
    if (result.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};