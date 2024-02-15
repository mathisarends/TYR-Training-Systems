import { Request, Response, NextFunction } from "express";
import User from "../src/models/user.model.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";

export async function checkAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.isAuthenticated()) {
      // @ts-ignore
      const user = await User.findById(req.user?._id);

      if (!user) {
        res.status(404).send("Benutzer nicht gefunden!");
      }

      res.locals.user = user;
      return next();
    }
    res.redirect("/login");
  } catch (error) {
    console.error("Fehler beim Abrufen des Benutzers", error);
    return res.status(500).send("Internal server error");
  }
}

export function checkNotAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
