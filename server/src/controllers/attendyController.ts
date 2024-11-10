import { Request, Response } from "express";
import { Attendy } from "../models";

export const createUpdateAttendy = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  //const eventId = id;
  const userId = (req as any).user?.id;
  console.log("id: ", eventId, userId);
  const attendy = await Attendy.findOne({ where: { eventId, userId } });
  const { status } = req.body;
  console.log("Attendy: ", attendy);
  if (!attendy) {
    try {
      const newAttendy = await Attendy.create({
        status,
        eventId,
        userId,
      });

      res
        .status(201)
        .json({ message: "Attendy created successfully", data: newAttendy });
      return;
    } catch (err) {
      res.status(500).json({ message: "Failed to create attendy", err });
      return;
    }
  } else {
    try {
      await attendy.update({
        status,
      });

      res
        .status(201)
        .json({ message: "Attendy updated successfully", data: attendy });
    } catch (err) {
      res.status(500).json({ message: "Failed to update attendy", err });
      return;
    }
  }
};

export const getAttendy = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  //const eventId = id;
  const userId = (req as any).user?.id;
  //console.log("id: ", eventId, userId);

  try {
    const attendy = await Attendy.findOne({ where: { eventId, userId } });

    if (!attendy) {
      res.status(404).json({ message: "Attendy not found or unauthorized" });
      return;
    }

    res.status(200).json({ data: attendy });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving attendy", error });
    return;
  }
};
