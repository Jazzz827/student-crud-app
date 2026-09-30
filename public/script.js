const API_URL = "/api/students";

const studentForm = document.getElementById("studentForm");
const studentMongoId = document.getElementById("studentMongoId");

const studentIdInput = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const programInput = document.getElementById("program");

const studentTableBody = document.getElementById("studentTableBody");

const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

const formTitle = document.getElementById("formTitle");
const message = document.getElementById("message");

// LOAD STUDENTS
async function loadStudents() {
  try {
    const response = await fetch(API_URL);
    const students = await response.json();

    studentTableBody.innerHTML = "";

    students.forEach(student => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.studentId}</td>
        <td>${student.name}</td>
        <td>${student.program}</td>
        <td>
          <button class="edit-button" onclick="editStudent('${student._id}')">Edit</button>
          <button class="delete-button" onclick="deleteStudent('${student._id}')">Delete</button>
        </td>
      `;

      studentTableBody.appendChild(row);
    });
  } catch (error) {
    showMessage("Error loading students: " + error.message, true);
  }
}

// SHOW MESSAGE
function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#e74c3c" : "#27ae60";

  setTimeout(() => { message.textContent = ""; }, 3000);
}

// RESET FORM
function resetForm() {
  studentForm.reset();
  studentMongoId.value = "";
  formTitle.textContent = "Add Student";
  submitButton.textContent = "Add Student";
  cancelButton.style.display = "none";
}

// ADD OR UPDATE STUDENT
studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentData = {
    studentId: studentIdInput.value.trim(),
    name: nameInput.value.trim(),
    program: programInput.value.trim(),
  };

  const editingId = studentMongoId.value;

  try {
    let response;

    if (editingId) {
      response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
    } else {
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    showMessage(editingId ? "Student updated successfully!" : "Student added successfully!");

    resetForm();
    loadStudents();
  } catch (error) {
    showMessage(error.message, true);
  }
});

// EDIT STUDENT
async function editStudent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const student = await response.json();

    if (!response.ok) {
      throw new Error(student.message || "Student not found");
    }

    studentMongoId.value = student._id;
    studentIdInput.value = student.studentId;
    nameInput.value = student.name;
    programInput.value = student.program;

    formTitle.textContent = "Edit Student";
    submitButton.textContent = "Update Student";
    cancelButton.style.display = "inline-block";

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    showMessage(error.message, true);
  }
}

// DELETE STUDENT
async function deleteStudent(id) {
  const confirmDelete = confirm("Are you sure you want to delete this student?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete student");
    }

    showMessage("Student deleted successfully!");
    loadStudents();
  } catch (error) {
    showMessage(error.message, true);
  }
}

// CANCEL EDIT
cancelButton.addEventListener("click", () => {
  resetForm();
});

// INITIAL LOAD
loadStudents();