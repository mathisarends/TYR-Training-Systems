import mongoose, { Schema } from "mongoose";
import TrainingDay from "./trainingDaySchema.js";

const trainingWeekSchema = new mongoose.Schema({
  trainingDays: [TrainingDay.schema],
  squatSetsDone: Number,
  squatTonnage: Number,
  benchSetsDone: Number,
  benchTonnage: Number,
  deadliftSetsDone: Number,
  deadliftTonnage: Number,
  parentTrainingPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrainingBlock",
  },
});

const trainingBlockSchema = new mongoose.Schema({
  title: String,
  isTemplate: {
    type: Boolean,
    default: false,
  },
  trainingFrequency: Number,
  trainingPhase: {
    type: String,
    enum: ["hypertrophie", "kraft"],
    default: "hypertrophie",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  automaticProgressionEnabled: Boolean,
  lastWeekDeloadEnabled: Boolean,
  weightRecommandationBase: {
    type: String,
    enum: ["max", "lastWeek", "off"],
    default: "max",
  },
  trainingWeeks: [trainingWeekSchema],
});

const TrainingBlock = mongoose.model("TrainingBlock", trainingBlockSchema);

export default TrainingBlock;
