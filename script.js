const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Load tasks from localStorage or use empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    // Task text
    const span = document.createElement("span");
    span.textContent = task.text;
    span.classList.add("task-content");
    if (task.completed) span.classList.add("completed");
    span.addEventListener("click", () => toggleTask(index));

    // Action buttons
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("action-btns");

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => editTask(index));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteTask(index));

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(btnContainer);
    taskList.appendChild(li);
  });

  updateProgress();
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function updateProgress() {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  progressBar.style.width = percentage + "%";
  progressText.textContent = `${percentage}% Completed`;
}

// Event Listeners
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// Initial render
renderTasks();
