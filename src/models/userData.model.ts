import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bodyWeight: {
    type: Number,
  },
  bodyHeight: {
    type: Number,
  },
  age: {
    type: Number,
  },
  maxSquat: {
    type: Number,
  },
  maxBench: {
    type: Number,
  },
  maxDeadlift: {
    type: Number,
  },
  total: {
    type: Number,
  },
  nutrition: {
    type: String,
    enum: ["schlecht", "gut", "optimal"],
  },
  sleepQuality: {
    type: String,
    enum: ["schlecht", "gut", "optimal"],
  },
  stress: {
    type: String,
    enum: ["hoch", "mittel", "niedrig"],
  },
  doping: {
    type: String,
    enum: ["ja", "nein"],
  },
  regenerationCapacity: {
    type: String,
    enum: [
      "schlecht",
      "unterdurchschnittlich",
      "durchschnittlich",
      "gut",
      "perfekt",
    ],
  },
  strengthLevel: {
    type: String,
    enum: [
      "Elite",
      "Master",
      "Class 1",
      "Class 2",
      "Class 3",
      "Class 4",
      "Class 5",
    ],
  },
  trainingExperience: {
    type: String,
    enum: ["beginner", "fortgeschritten", "sehrFortgeschritten", "experte"],
  },
  gender: {
    type: String,
    enum: ["männlich", "weiblich"],
  },

  recentSquatWeight: {
    type: Number,
  },
  recentSquatReps: {
    type: Number,
  },
  recentBenchWeight: {
    type: Number,
  },
  recentBenchReps: {
    type: Number,
  },
  recentDeadliftWeight: {
    type: Number,
  },
  recentDeadliftReps: {
    type: Number,
  },
  minimumSetsSquat: {
    type: Number,
  },
  maximumSetsSquat: {
    type: Number,
  },
  minimumSetsBench: {
    type: Number,
  },
  maximumSetsBench: {
    type: Number,
  },
  minimumSetsDeadlift: {
    type: Number,
  },
  maximumSetsDeadlift: {
    type: Number,
  },
});

const userData = mongoose.model("UserData", userDataSchema);
export default userData;
