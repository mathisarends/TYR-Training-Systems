import express from "express";
const router = express.Router();

import { Request, Response } from "express";

import { checkAuthenticated } from "../middleware/authMiddleware.js";

router.get("/", checkAuthenticated, async (req, res) => showVolumePage(req, res));

async function showVolumePage(req: Request, res: Response) {
    try {
      const user = res.locals.user;
  
      res.render("volume", {
        defaultLayout: true,
        carousel: false,

        // Hier weiteren kram rein
      });
    } catch (error) {
      console.log(
        "Ein Fehler beim Laden der Exercise-Seite ist aufgetreten!",
        error
      );
    }
  }


export default router;