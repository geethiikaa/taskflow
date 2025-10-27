const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

displayTasks(tasks);
updateProgress();

addBtn.addEventListener("click", addTask);

function addTask() {
  const text = input.value.trim();
  if (text === "") return;

  if (editIndex !== null) {
    // Editing existing task
    tasks[editIndex].text = text;
    editIndex = null;
    addBtn.textContent = "Add";
  } else {
    // Adding new task
    tasks.push({ text, done: false });
  }

  input.value = "";
  saveAndRender();
}

function displayTasks(taskList) {
  list.innerHTML = "";
  taskList.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="task-text ${task.done ? "completed" : ""}">
        ${task.text}
      </span>
      <div class="actions">
        <button onclick="toggleTask(${index})">${task.done ? "✅" : "☐"}</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  saveAndRender();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  saveAndRender();
}

function editTask(i) {
  input.value = tasks[i].text;
  editIndex = i;
  addBtn.textContent = "Update";
}

function filterTasks(type) {
  if (type === "all") displayTasks(tasks);
  else if (type === "completed") displayTasks(tasks.filter(t => t.done));
  else displayTasks(tasks.filter(t => !t.done));
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  progressBar.style.width = percent + "%";
  progressText.textContent = `${percent}% Completed`;
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks(tasks);
  updateProgress();
}
