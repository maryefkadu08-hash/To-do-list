// Get elements from HTML.
const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskTime = document.getElementById("task-time");
const taskList = document.getElementById("task-list");

const taskCount = document.getElementById("task-count");
const completedCount = document.getElementById("completed-count");
const emptyMessage = document.getElementById("empty-message");
const clearButton = document.getElementById("clear-button");

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];

function saveTasks() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark " + task.name + " as completed");

    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const name = document.createElement("div");
    name.className = "task-name";
    name.textContent = task.name;

    content.appendChild(name);

    if (task.date || task.time) {
      const dateTime = document.createElement("div");
      dateTime.className = "task-date";

      const details = [];

      if (task.date) {
        details.push("Date: " + task.date);
      }

      if (task.time) {
        details.push("Time: " + task.time);
      }

      dateTime.textContent = details.join(" | ");
      content.appendChild(dateTime);
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      tasks = tasks.filter(function (item) {
        return item.id !== task.id;
      });

      saveTasks();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  });

  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  }).length;

  taskCount.textContent =
    tasks.length + (tasks.length === 1 ? " task" : " tasks");

  completedCount.textContent = completedTasks + " completed";

  emptyMessage.hidden = tasks.length > 0;

  clearButton.hidden = tasks.length === 0;
}

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskName = taskInput.value.trim();

  if (taskName === "") {
    alert("Please enter a task!");
    return;
  }

  const newTask = {
    id: Date.now(),
    name: taskName,
    date: taskDate.value,
    time: taskTime.value,
    completed: false,
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();

  todoForm.reset();
  taskInput.focus();
});

clearButton.addEventListener("click", function () {
  const confirmed = confirm("Are you sure you want to delete all tasks?");

  if (confirmed) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

renderTasks();
