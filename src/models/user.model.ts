import mongoose from "mongoose";
import TrainingBlock from "./trainingBlock.model.js";
import TrainingSession from "./trainingSession.model.js";
import Exercise from "./exercise.model.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: String,
  lastActivity: {
    type: Date,
    get: (timestamp : Date) => {
        const options : Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(timestamp).toLocaleDateString('de-DE', options);
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: String, // for google oauth
  passwordHash: String, // regular registration
  templatePlans: [TrainingBlock.schema],
  customPlans: [TrainingBlock.schema],
  trainingSessions: [TrainingSession.schema],

  placeholderExercises: [Exercise.schema],
  exercises: [Exercise.schema],
  squatExercises: [Exercise.schema],
  benchExercises: [Exercise.schema],
  deadliftExercises: [Exercise.schema],
  overheadpressExercises: [Exercise.schema],
  chestExercises: [Exercise.schema],
  backExercises: [Exercise.schema],
  shoulderExercises: [Exercise.schema],
  tricepsExercises: [Exercise.schema],
  bicepsExercises: [Exercise.schema],
  legExercises: [Exercise.schema],

  resetToken: String,
  resetTokenExpiration: Number,
});

const User = mongoose.model("User", userSchema);

export default User;
