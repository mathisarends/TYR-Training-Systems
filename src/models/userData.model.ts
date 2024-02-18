import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bodyWeight: {
    type: Number,
    validate: {
      validator: function(value : number) {
        return value >= 0
      },
      message: "Körpergewicht darf nicht negativ sein",
    }
  },
  bodyHeight: {
    type: Number,
    validate: {
      validator: function(value : number) {
        return value >= 0
      },
      message: "Körpergröße darf nicht negativ sein",
    }
  },
  age: {
    type: Number,
    validate: {
      validator: function(value : number) {
        return value >= 0
      },
      message: "Alter muss einen validen Wert haben",
    }
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
  sleep: {
    type: String,
    enum: ["schlecht", "gut", "optimal"],
  },
  stress: {
    type: String,
    enum: ["hoch", "mittel", "niedrig"],
  },
  manual: {
    type: Number,
    validate: {
      validator: function (value : number) {
        return value >= -5 && value <= 5;
      },
      message: 'Der Wert für "manuel" muss im Bereich von -5 bis 5 liegen.',
    },
  },
  trainingExperience: {
    type: Number,
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

const UserData = mongoose.model("UserData", userDataSchema);
export default UserData;
