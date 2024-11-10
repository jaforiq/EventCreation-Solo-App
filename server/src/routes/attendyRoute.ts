import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createUpdateAttendy,
  getAttendy,
} from "../controllers/attendyController";

const router = express.Router();

// Authenticate Route
router.post("/create/:eventId", authenticateToken, createUpdateAttendy);
router.get("/get/:eventId", authenticateToken, getAttendy);

export default router;
