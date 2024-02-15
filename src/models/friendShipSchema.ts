import mongoose from "mongoose";

const friendShipSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Hier musst du den richtigen Namen deines Benutzermodells angeben
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Hier musst du den richtigen Namen deines Benutzermodells angeben
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "sent"],
    default: "sent",
  },
  friendSince: {
    type: Date,
    default: Date.now,
  },
});

// Eindeutiger Index für die Kombination von "user" und "friend"
friendShipSchema.index({ user: 1, friend: 1 }, { unique: true });

const Friendship = mongoose.model("Friendship", friendShipSchema);

export default Friendship;
