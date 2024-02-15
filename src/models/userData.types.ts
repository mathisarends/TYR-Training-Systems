export interface UserDataInterface {
  user: "string";
  bodyweight: number;
  bodyHeight: number;
  age: number;
  maxSquat: number;
  maxBench: number;
  maxDeadlift: number;
  total: number;
  nutrition: "schlecht" | "gut" | "optimal";
  sleepQuality: "schlecht" | "gut" | "optimal";
  stress: "hoch" | "mittel" | "niedrig";
  doping: "ja" | "nein";
  regenerationCapacity:
    | "schlecht"
    | "unterdurchschnittlich"
    | "durchschnittlich"
    | "gut"
    | "perfekt";
  strengthLevel:
    | "Elite"
    | "Master"
    | "Class 1"
    | "Class 2"
    | "Class 3"
    | "Class 4"
    | "Class 5";
  trainingExperience:
    | "beginner"
    | "fortgeschritten"
    | "sehr fortgeschritten"
    | "experte";
  gender: "männlich" | "weiblich";
  recentSquatWeight: number;
  recentSquatReps: number;
  recentBenchWeight: number;
  recentBenchReps: number;
  recentDeadliftWeight: number;
  recentDeadliftReps: number;
  minimumSetsSquat: number;
  maximumSetsSquat: number;
  minimumSetsBench: number;
  maximumSetsBench: number;
  minimumSetsDeadlift: number;
  maximumSetsDeadlift: number;
}
