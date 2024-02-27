import User from "../src/models/user.model.js";
import UserData from "../src/models/userData.model.js";

import bcrypt from "bcrypt";

import { 
  placeHolderExercises, 
  squatExercises, 
  benchExercises, 
  deadliftExercises, 
  overheadpressExercises, 
  chestExercises,
  backExercises, 
  shoulderExercises, 
  bicepsExercises, 
  tricepExercises, 
  legExercises
} from "../src/generators/standartExeciseCatalog.js";
import templateTrainingPlans from "../src/generators/templateTrainingPlans.js";

import { Request, Response } from "express";

import passwordValidator from "password-validator";
import { ObjectId } from "mongodb";
const passwordSchema = new passwordValidator();

if (process.env.NODE_ENV === "PRODUCTION") {
  console.log("here we are");
  passwordSchema // length of 8, one capital letter, one number no spaces
    .is()
    .min(8)
    .is()
    .max(100)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits(1)
    .has()
    .not()
    .spaces();
} else if (process.env.NODE_ENV !== "production") {
  // umgebungsvariable ist gar nicht gesetzt btw
}

export function getRegisterIndex(req: Request, res: Response) {
  res.render("register", {
    header: false,
    footer: false,
    defaultLayout: false,
  });
}

export async function handleRegisterPost(req: Request, res: Response) {
  let newUser; // declaration in this scope so that the user can be deleted automatically if
  // there is an error with the user registration
  try {
    //if there is an user with that email or name prevent registration and show error
    const existingUser = await User.findOne({
      $or: [{ name: req.body.name }, { email: req.body.email }],
    });

    if (existingUser) {
      res
        .status(409)
        .json({ success: false, message: "Benutzer bereits vorhanden!" });
      return;
    }

    const password = req.body.password;

    // if the provided passwords do not match show an error
    if (password !== req.body.repeatPassword) {
      res
        .status(422)
        .json({ success: false, message: "Passwörter stimmen nicht überein!" });
      return;
    }

    // the password does not fullfull the requirements
    if (!passwordSchema.validate(password)) {
      // errors contains a list of missing requirements
      const errors = passwordSchema.validate(password, {
        list: true,
      }) as string[];

      let errorMessage = "";

      if (errors.includes("uppercase")) {
        errorMessage += "Mindestens 1 Großbuchstabe<br>";
      }

      if (errors.includes("lowercase")) {
        errorMessage += "Mindestens 1 Kleinbuchstabe<br>";
      }

      if (errors.includes("min")) {
        errorMessage += "Mindestens 8 Zeichen<br>";
      }

      if (errors.includes("spaces")) {
        errorMessage += "Keine Leerzeichen<br>";
      }

      if (errors.includes("digits")) {
        errorMessage += "Mindestens 1 Zahl<br>";
      }

      res
        .status(422)
        .json({
          success: false,
          message: "Passwortanforderungen nicht erfüllt",
          details: errorMessage,
        });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    newUser = new User({
      name: req.body.username,
      email: req.body.email,
      passwordHash: hashedPassword,

      placeholderExercises: placeHolderExercises,
      squatExercises: squatExercises,
      benchExercises: benchExercises,
      deadliftExercises: deadliftExercises,
      overheadpressExercises: overheadpressExercises,
      chestExercises: chestExercises,
      backExercises: backExercises,
      shoulderExercises: shoulderExercises,
      tricepsExercises: tricepExercises,
      bicepsExercises: bicepsExercises,
      legExercises: legExercises,
    });

    await newUser.save();
    console.log("User wurde erfolgreich erstellt");

    let userID: ObjectId = newUser._id;

    await newUser.save();

    newUser.templatePlans.push(
      templateTrainingPlans.createTemplatePlanA(userID),
    );
    newUser.templatePlans.push(
      templateTrainingPlans.createTemplatePlanB(userID),
    );

    await newUser.save();
    console.log("Template TrainingPlan erfolgreich gespeichert");

    const userConfig = await UserData.findOne({ user: userID });

    // StandartFall: Nach der Registrierung gibt es noch keine solche config
    if (!userConfig) {
      // Falls für den Benutzer keine Konfiguration gefunden wurde, erstelle eine neue
      const newUserConfig = new UserData({ user: userID });

      newUserConfig.bodyWeight = null;
      newUserConfig.bodyHeight = null;
      newUserConfig.age = null;
      newUserConfig.trainingExperience = null;
      newUserConfig.sleep = null;
      newUserConfig.nutrition = null;
      newUserConfig.stress = null;

      // standartwerte
      newUserConfig.manual = 0;

      await newUserConfig.save();
      console.log("Neue Benutzerkonfiguration erstellt.");

    }

    res
      .status(201)
      .json({ success: true, message: "Benutzer erfolgreich erstellt" });
  } catch (err) {
    console.error(err);

    if (newUser) {
      // if there is an error delete the newly created user from the database
      await User.deleteOne({ _id: newUser._id });
      console.log(
        "Neu erstellter Benutzer aufgrund eines Registrierungsfehlers gelöscht",
      );
    }

    res
      .status(500)
      .json({ success: false, message: "Fehler bei der Registrierung." });
  }
}

export async function getConfigPage(req: Request, res: Response) {
  try {
    const userID = req.query.userID; // from query-parameter

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).send("Benutzer nicht gefunden.");
    }

    res.render("register/registerConfig", { user, layout: false });
  } catch (err) {
    console.error("Error while requesting the config file", err);
  }
}

export async function postConfigPage(req: Request, res: Response) {
  try {
    const userID = req.query.userID; // from query-parameter

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).send("Benutzer nicht gefunden.");
    }

    const gender = req.body.gender;
    const height = req.body.height;
    const bodyWeight = req.body.bodyWeight;
    const age = req.body.age;

    const maxSquat = req.body.maxSquat;
    const maxBench = req.body.maxBench;
    const maxDeadlift = req.body.maxDeadlift;
    const strengthLevel = req.body.strengthLevel;

    const trainingExperience = req.body.trainingExperience;
    const sleep = req.body.sleep;
    const nutrition = req.body.nutrition;
    const stress = req.body.stress;

    const userConfig = await UserData.findOne({ user: userID });

    // StandartFall: Nach der Registrierung gibt es noch keine solche config
    if (!userConfig) {
      // Falls für den Benutzer keine Konfiguration gefunden wurde, erstelle eine neue
      const newUserConfig = new UserData({ user: userID });

      newUserConfig.bodyWeight = bodyWeight;
      newUserConfig.bodyHeight = height;
      newUserConfig.age = age;
      newUserConfig.maxSquat = maxSquat;
      newUserConfig.maxBench = maxBench;
      newUserConfig.maxDeadlift = maxDeadlift;
      newUserConfig.trainingExperience = trainingExperience;
      newUserConfig.sleep = sleep;
      newUserConfig.nutrition = nutrition;
      newUserConfig.stress = stress;

      // standartwerte
      newUserConfig.manual = 0;

      await newUserConfig.save();
      console.log("Neue Benutzerkonfiguration erstellt.");
    } else {
      userConfig.bodyWeight = bodyWeight;
      userConfig.bodyHeight = height;
      userConfig.age = age;
      userConfig.maxSquat = maxSquat;
      userConfig.maxBench = maxBench;
      userConfig.maxDeadlift = maxDeadlift;
      userConfig.trainingExperience = trainingExperience;
      userConfig.sleep = sleep;
      userConfig.nutrition = nutrition;
      userConfig.stress = stress;
      // standartwerte
      userConfig.manual = 0;
    }

    await user.save();

    res.status(200).json({});

    console.log(user);
  } catch (err) {
    console.error(
      "Es ist ein Fehler bei der Volumenconfig aufgetreten: " + err,
    );
    res
      .status(500)
      .json({ error: "Fehler beim Verarbeiten der Formulardaten" });
  }
}
