import mongoose from "mongoose";

const trainingDaySchema = new mongoose.Schema({
  exercises: [
    {
      category: String,
      exercise: String,
      sets: Number,
      reps: Number,
      weight: String,
      targetRPE: Number,
      actualRPE: Number,
      estMax: Number,
      notes: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});



const TrainingDay = mongoose.model("TrainingDay", trainingDaySchema);
export default TrainingDay;
