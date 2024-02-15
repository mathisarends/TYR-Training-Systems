import { Request, Response } from "express";

export function handleLogout(req: Request, res: Response) {
  req.logout(() => {}); // logout => empty callback
  res.redirect("/login"); // back to login
}
