import mongoose from "mongoose";   

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" }
});

export default mongoose.model("User", userSchema);