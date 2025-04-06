const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String },
  profession: { type: String, default: "" },
  skills: { type: [String], default: [] },
  story: { type: String, default: "" },
  onboarded: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
