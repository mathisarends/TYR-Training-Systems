import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
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
  legExercises,
} from "./src/generators/standartExeciseCatalog.js";

import templateTrainingPlans from "./src/generators/templateTrainingPlans.js";
import User from "./src/models/user.model.js";
import UserData from "./src/models/userData.model.js";

// use environment variables instead
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.BASE_URL}/google/callback`,
    passReqToCallback: true
  },
  //@ts-ignore
  async function(request: Request, accessToken: string, refreshToken: string, profile: any, done: any) {

    let newUser;

    try {
      // Suchen nach einem Benutzer mit der Google ID
      const existingUser = await User.findOne({ googleId: profile.id });
      
      if (existingUser) {
        // Benutzer gefunden, gebe ihn zurück
        return done(null, existingUser);
      } else {
        // Benutzer nicht gefunden, erstelle einen neuen Benutzer
        newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.email,

          placeholderExercises: placeHolderExercises,
          squatExercises: squatExercises,
          benchExercises: benchExercises,
          deadliftExercises: deadliftExercises,
          overheadpressExercises: overheadpressExercises,
          backExercises: backExercises,
          chestExercises: chestExercises,
          shoulderExercises: shoulderExercises,
          bicepsExercises: bicepsExercises,
          tricepExercises: tricepExercises,
          legExercises: legExercises,
        });

        // Speichern des neuen Benutzers in der Datenbank
        await newUser.save();

        const userConfig = await UserData.findOne({ user: newUser._id });

        // StandartFall: Nach der Registrierung gibt es noch keine solche config
        if (!userConfig) {
          // Falls für den Benutzer keine Konfiguration gefunden wurde, erstelle eine neue
          const newUserConfig = new UserData({ user: newUser._id });
    
          newUserConfig.bodyWeight = null;
          newUserConfig.bodyHeight = 0;
          newUserConfig.age = 0;
          newUserConfig.maxSquat = 0;
          newUserConfig.maxBench = 0;
          newUserConfig.maxDeadlift = 0;
          newUserConfig.trainingExperience = 3;
          newUserConfig.sleep = "optimal";
          newUserConfig.nutrition = "optimal";
          newUserConfig.stress = "mittel";
    
          // standartwerte
          newUserConfig.manual = 0;
    
          await newUserConfig.save();
          console.log("Neue Benutzerkonfiguration erstellt.");
          
        }

        //@ts-ignore
        newUser.templatePlans.push(templateTrainingPlans.createTemplatePlanA(newUser._id));
        newUser.templatePlans.push(templateTrainingPlans.createTemplatePlanB(newUser._id));

        await newUser.save();
        
        return done(null, newUser);
      }
    } catch (err) {
      console.error("Fehler bei Google-Authentifizierung:", err);

      // Lösche den neu erstellten Benutzer, wenn ein Fehler auftritt
      if (newUser) {
        await User.deleteOne({ _id: newUser._id });
      }

      return done(err, null);
    }
  }
));

//bin mir nicht sicher ob ich die hier brauche todo: 
passport.serializeUser(function(user, done) {
    done(null, user);
})

passport.deserializeUser(function(user: any, done) {
    done(null, user);
})