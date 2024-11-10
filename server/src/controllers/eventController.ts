import { Request, RequestHandler, Response } from "express";
import Event from "../models/Event";
import { EventGenre, Genre } from "../models";

export const createEvent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      details,
      thumbnailUrl,
      location,
      startDate,
      endDate,
      genreId,
    } = req.body;
    const userId = (req as any).user?.id; // authenticated user

    const newEvent = await Event.create({
      title,
      details,
      thumbnailUrl,
      location,
      startDate,
      endDate,
      userId,
    });

    if (!newEvent) res.status(500).json({ message: "Failed to create event" });
    console.log("GenId: ", genreId);
    for (let i = 0; i < genreId.length; i++) {
      const genreid = genreId[i].value;
      EventGenre.create({
        eventId: newEvent.id,
        genreId: genreid,
      });
    }

    res
      .status(201)
      .json({ message: "Event created successfully", data: newEvent });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to create event", error });
    return;
  }
};

export const updateEvent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const {
    title,
    details,
    location,
    startDate,
    endDate,
    genreId,
    thumbnailUrl,
  } = req.body;
  const userId = (req as any).user?.id;
  console.log("req: ", req);
  try {
    const event = await Event.findOne({ where: { id, userId } });

    if (!event) {
      res.status(404).json({ message: "Event not found or unauthorized" });
      return;
    }

    await event.update({
      title,
      details,
      location,
      startDate,
      endDate,
      thumbnailUrl,
    });
    res
      .status(200)
      .json({ message: "Event updated successfully", data: event });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to update event", error });
    return;
  }
};

export const deleteEvent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  try {
    const event = await Event.findOne({ where: { id, userId } });

    if (!event) {
      res.status(404).json({ message: "Event not found or unauthorized" });
      return;
    }

    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event", error });
    return;
  }
};

export const getAllEvents: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await Event.findAll();
    res.status(200).json({ data: events });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events", error });
    return;
  }
};

export const getEventsById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  //const userId = (req as any).user?.id;

  try {
    const event = await Event.findOne({ where: { id } });

    if (!event) {
      res.status(404).json({ message: "Event not found or unauthorized" });
      return;
    }

    res.status(200).json({ data: event });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events", error });
    return;
  }
};

export const userEvents: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user?.id;

  try {
    const event = await Event.findAll({ where: { userId } });

    if (!event) {
      res.status(404).json({ message: "Event not found or unauthorized" });
      return;
    }

    res.status(200).json({ data: event });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events", error });
    return;
  }
};
