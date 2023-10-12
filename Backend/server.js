import express from "express";
import { Server } from "socket.io";
import { db } from "./database/connection.js";
import { Note } from "./database/models/note.model.js";
const app = express();

db();

const server = app.listen(3000, () =>
  console.log("Backend server running on port 3000")
);

const io = new Server(server, {
  cors: "*",
});

io.on("connection", (socket) => {
  socket.on("add-note", async (note) => {
    await Note.create(note);

    let allNotes = await Note.find();

    socket.emit("notes", allNotes);
  });

  socket.on("get-notes", async () => {
    let allNotes = await Note.find();

    socket.emit("notes", allNotes);
  });

  socket.on("delete-note", async (id) => {
    await Note.findByIdAndDelete(id);

    let allNotes = await Note.find();
    socket.emit("notes", allNotes);
  });

  socket.on("update-note", async (note) => {
    await Note.findByIdAndUpdate(note.id, {
      title: note.title,
      description: note.description,
    });

    let allNotes = await Note.find();
    socket.emit("notes", allNotes);
  });
});
