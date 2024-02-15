import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express, { Express } from "express";
import session from "express-session";
import passport from "passport";
import expressLayouts from "express-ejs-layouts";
import methodOverride from "method-override";

import { initialize as initializePassport } from "./passport-config.js";
import startDB from "./db.js";
/* import "./oauth.js"; */

import loginRouter from "./routes/login.js";
import registerRouter from "./routes/register.js";
import logoutRouter from "./routes/logout.js";
import exerciseRouter from "./routes/exercises.js";
import indexRouter from "./routes/index.js";
import profileRouter from "./routes/profile.js";

import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT;
const app = express();

const secret = process.env.SESSION_SECRET!;
const basedir = fileURLToPath(path.dirname(import.meta.url));

// Session Middleware
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // session-time
  }),
);

// Static Files
app.use(express.static(path.join(basedir, "src", "public")));
app.use(express.static(path.join(basedir, "dist", "src", "public")));

// Template Engine
app.set("view engine", "ejs");
app.set("views", path.join(basedir, "src", "views"));
app.set("layout", path.join(basedir, "src", "views", "layouts", "layout"));
app.use(expressLayouts);
app.use(methodOverride("_method"));

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);


app.use("/", indexRouter);
app.use("/profile", profileRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/logout", logoutRouter);
app.use("/exercises", exerciseRouter);

// Database and Server Start
startDB(app, () => startServer(app));

function startServer(app: Express) {
  app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`);
  });
}
