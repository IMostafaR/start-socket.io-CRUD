const socket = io("http://localhost:3000/");

let notes = [];
let titleInput = document.getElementById("note-title");
let descriptionInput = document.getElementById("note-description");
let addNoteBtn = document.getElementById("add-note");
let updateNoteBtn = document.getElementById("update-note");

function displayNotes(notes) {
  let noteDiv = ``;

  notes.forEach((note) => {
    noteDiv += `
    <div class="col-md-4 mb-5">
    <div class="border rounded-4 shadow">
      <h4
        class="bg-warning py-2 rounded-top-4 text-center"
      >${note.title}</h4>
      <p class="py-2 px-3 text-center fw-medium">${note.description}</p>
      <div class="d-flex justify-content-around pb-3">
      <button class="btn btn-success fw-bold" onclick="update('${note._id}', '${note.title}', '${note.description}')">Update</button>
      <button class="btn btn-danger fw-bold" onclick="deleteNote('${note._id}')">Delete</button>
      </div>
    </div>
  </div>
        `;
  });
  document.getElementById("notes").innerHTML = noteDiv;
}

socket.on("connect", () => {
  socket.emit("get-notes");

  socket.on("notes", (notes) => {
    displayNotes(notes);
  });
});

function addNote() {
  let note = {
    title: titleInput.value,
    description: descriptionInput.value,
  };

  socket.emit("add-note", note);
  socket.on("notes", (notes) => {
    displayNotes(notes);
  });

  titleInput.value = "";
  descriptionInput.value = "";
}

function deleteNote(id) {
  socket.emit("delete-note", id);
  socket.on("notes", (notes) => {
    displayNotes(notes);
  });
}

function update(id, title, description) {
  titleInput.value = title;
  descriptionInput.value = description;

  updateNoteBtn.classList.replace("d-none", "d-block");
  addNoteBtn.classList.replace("d-block", "d-none");
  updateNoteBtn.setAttribute("data-id", id);
}

function updateNote() {
  let note = {
    id: updateNoteBtn.getAttribute("data-id"),
    title: titleInput.value,
    description: descriptionInput.value,
  };
  console.log(note);

  socket.emit("update-note", note);
  socket.on("notes", (notes) => {
    displayNotes(notes);
  });

  titleInput.value = "";
  descriptionInput.value = "";

  updateNoteBtn.classList.replace("d-block", "d-none");
  addNoteBtn.classList.replace("d-none", "d-block");
  updateNoteBtn.removeAttribute("data-id");
}
