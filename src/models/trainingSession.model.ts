import mongoose, { mongo } from "mongoose";
import TrainingDay from "./trainingDaySchema.js";

const trainingSessionSchema = new mongoose.Schema({
  title: String,
  lastUpdated: Date,
  trainingPhase: String,
  date: Date,
  trainings: [TrainingDay.schema],
});

const TrainingSession = mongoose.model(
  "TrainingSession",
  trainingSessionSchema,
);

export default TrainingSession;
