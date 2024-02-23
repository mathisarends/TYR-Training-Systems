import { Strategy as LocalStrategy } from "passport-local";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "./src/models/user.model.js";

import passport, { PassportStatic } from "passport";
import userData from "./src/models/userData.model.js";

export function initialize(passport: PassportStatic) {
  const authenticateUser = async (
    username: string,
    password: string,
    done: any,
  ) => {
    try {
      // find by username or password
      const user = await User.findOne({
        $or: [{ name: username }, { email: username }],
      });
      if (!user) {
        return done(null, false, {
          message: "No user with that name or email",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash!,
      );
      if (isPasswordValid) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser),
  );
  passport.serializeUser((user: any, done) => done(null, user.id)); // check if any makes any trouble
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });
}

export function customLoginMiddleware(passport: PassportStatic) {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: any, info: any) => {
      if (err) {
        // Fehler während der Anmeldung
        return res
          .status(500)
          .json({ success: false, message: "Anmeldefehler" });
      }

      if (!user) {
        // Anmeldung fehlgeschlagen
        if (info && info.message === "No user with that name or email") {
          // Nutzer nicht gefunden
          return res
            .status(401)
            .json({ success: false, message: "Nutzer nicht gefunden" });
        } else if (info && info.message === "Password incorrect") {
          // Falsches Passwort
          return res
            .status(401)
            .json({ success: false, message: "Falsches Passwort" });
        } else {
          // Anderer Grund für das Scheitern
          return res
            .status(401)
            .json({ success: false, message: "Anmeldung fehlgeschlagen" });
        }
      }

      // Anmeldung erfolgreich
      req.logIn(user, async (err) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Anmeldung fehlgeschlagen" });
        } else {
          await updateLastActivityUserField(user);

          return res
          .status(200)
          .json({ success: true, message: "Anmeldung erfolgreich" });
        }

      });
    })(req, res, next);
  };
}

async function updateLastActivityUserField(user : any) {
  try {
    user.lastActivity = new Date();
    await user.save();
  } catch (error) {
    console.log("Fehler beim speichern der last activity", error);
  }
}
