import { Request, Response } from "express";

export interface CustomRequest extends Request {
    user?: {
      _id: string; // Annahme: Der Typ von req.user._id ist eine Zeichenkette
    };
  }