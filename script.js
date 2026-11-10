
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskPriorityInput = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

const STORAGE_KEY = "interactiveTaskManagerTasks";


let tasks = loadTasks();


function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Could not load saved tasks:", error);
    return [];
  }
}


function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


function displayTasks() {
  taskList.innerHTML = "";

  const remainingTasks = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"} · ${remainingTasks} remaining`;

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "No tasks yet. Add your first task!";
    taskList.appendChild(emptyMessage);
    return;
  }

  tasks.forEach((task) => {
    const taskItem = document.createElement("article");
    taskItem.className = `task-item ${task.priority}${task.completed ? " completed" : ""}`;

    const taskDetails = document.createElement("div");
    taskDetails.className = "task-details";

    const taskName = document.createElement("span");
    taskName.className = "task-name";
    taskName.textContent = task.title;

    const priorityLabel = document.createElement("small");
    priorityLabel.className = `priority-label ${task.priority}`;
    priorityLabel.textContent = `${task.priority} priority`;

    taskDetails.appendChild(taskName);
    taskDetails.appendChild(priorityLabel);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "toggle-btn";
    toggleButton.textContent = task.completed ? "Undo" : "Complete";
    toggleButton.setAttribute(
      "aria-label",
      `${task.completed ? "Mark" : "Complete"} task: ${task.title}`
    );
    toggleButton.addEventListener("click", () => toggleTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete task: ${task.title}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.appendChild(toggleButton);
    actions.appendChild(deleteButton);

    taskItem.appendChild(taskDetails);
    taskItem.appendChild(actions);
    taskList.appendChild(taskItem);
  });
}


function addTask(title, priority) {
  const newTask = {
    id: Date.now().toString(),
    title: title,
    priority: priority,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  displayTasks();
}


function toggleTask(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  displayTasks();
}


function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  displayTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const priority = taskPriorityInput.value;

  if (title === "") {
    taskTitleInput.focus();
    return;
  }

  addTask(title, priority);
  taskForm.reset();
  taskPriorityInput.value = "medium";
  taskTitleInput.focus();
});

displayTasks();
