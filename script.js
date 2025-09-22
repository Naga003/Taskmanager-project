// Get all the important elements from the HTML file
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Load tasks from the browser's local storage.
// If there are no tasks stored, start with an empty array.
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// This function saves the current tasks array to local storage.
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// This is the main function that renders all tasks to the screen.
const renderTasks = () => {
  // Clear the existing list to avoid duplicates
  taskList.innerHTML = "";

  // Loop through each task in our array and create an element for it
  tasks.forEach((task, index) => {
    const listItem = document.createElement("li");

    // Create a custom checkbox for marking tasks as complete
    const completionCheckbox = document.createElement("input");
    completionCheckbox.type = "checkbox";
    completionCheckbox.checked = task.completed;
    completionCheckbox.classList.add("task-checkbox");
    completionCheckbox.addEventListener("change", () => toggleTask(index));

    // Create the span for the task's text
    const taskContent = document.createElement("span");
    taskContent.textContent = task.text;
    taskContent.classList.add("task-content");
    // Add a class for styling if the task is completed
    if (task.completed) {
      taskContent.classList.add("completed");
    }

    // Container for the action buttons (edit and delete)
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action-btns");

    // Create the edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => editTask(index));

    // Create the delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteTask(index));

    // Add buttons to their container
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    // Add all created elements to the list item
    listItem.appendChild(completionCheckbox);
    listItem.appendChild(taskContent);
    listItem.appendChild(buttonContainer);

    // Finally, add the list item to the main task list
    taskList.appendChild(listItem);
  });

  // Update the progress bar after rendering the tasks
  updateProgress();
};

// Function to add a new task to the list
const addTask = () => {
  const text = taskInput.value.trim();
  // Don't add a task if the input is empty
  if (text === "") {
    return;
  }

  // Push the new task object to our array
  tasks.push({ text, completed: false });
  // Save and re-render the list
  saveTasks();
  renderTasks();
  // Clear the input field
  taskInput.value = "";
};

// Function to toggle a task's completion status
const toggleTask = (index) => {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
};

// Function to edit an existing task's text
const editTask = (index) => {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
};

// Function to delete a task from the list
const deleteTask = (index) => {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
};

// Function to calculate and update the progress bar
const updateProgress = () => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  // Handle the case where there are no tasks to prevent division by zero
  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Update the width of the progress bar and the text
  progressBar.style.width = percentage + "%";
  progressText.textContent = `${percentage}% Completed`;
};

// Event listeners to handle user actions
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  // Allow users to press "Enter" to add a task
  if (e.key === "Enter") {
    addTask();
  }
});

// Initial call to render the tasks when the page loads
renderTasks();
