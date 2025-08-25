import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String },
  title: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expanded: { type: Boolean, default: false },
});

export default mongoose.models.Note || mongoose.model("Note", noteSchema);
