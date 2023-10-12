import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model("Note", noteSchema);
