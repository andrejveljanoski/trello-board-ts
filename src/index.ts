import "./index.css";
import { app, db } from "./api/firebase";
import { checkAuth } from "./api/auth";
import { tasksState, modalState } from "./state";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Task,
  TaskType,
  isValidTask,
  isValidTaskType,
  isValidTextInput,
} from "./types";
import { getTasksAndUpdateState } from "./api/tasks";

document.addEventListener("DOMContentLoaded", async () => {
  if (!app) {
    throw new Error("Firebase app is not initialized");
  }
  await checkAuth();

  // subscribe to changes in firebase and update state and html on every change
  getTasksAndUpdateState(renderTasks);

  console.log("Loaded state:", tasksState);

  // handle drag and drop
  const columns = document.getElementsByClassName("column");
  [...columns].forEach((c) => {
    // convert HTMLCollection to array
    const column = c as HTMLDivElement;
    const type = column.id; // column id is the task type
    column.ondragover = (e) => {
      e.preventDefault();
      column.style.border = "2px solid #000";
    };
    column.ondragleave = (e) => {
      e.preventDefault();
      column.style.border = "none";
    };
    column.ondrop = (e) => {
      e.preventDefault();
      column.style.border = "none";
      const task = JSON.parse(e.dataTransfer?.getData("text/plain") || "{}"); // get task from dataTransfer that is dropped

      if (!isValidTask(task) || !task.id) {
        throw new Error("Task is invalid");
      }
      const taskRef = doc(db, "tasks", task.id);
      updateDoc(taskRef, {
        type, // update task type to the column type
      });
    };
  });

  // add listeners to new task buttons
  [...document.getElementsByClassName("add-task-button")].forEach((b) => {
    const button = b as HTMLButtonElement;
    button.onclick = () => {
      if (isValidTaskType(button.id)) {
        openAddTaskModal(button.id);
      }
    };
  });

  // add listener to close modal button
  const closeAddTaskModalButton = document.getElementById(
    "close-add-task-modal",
  );

  if (!closeAddTaskModalButton)
    throw new Error("Close Add Task Modal Button not found");

  closeAddTaskModalButton.onclick = closeAddTaskModal;
});

const openAddTaskModal = (type: TaskType) => {
  modalState.type = type;
  modalState.isOpen = true;
  renderModal();
};

const closeAddTaskModal = () => {
  modalState.type = "";
  modalState.isOpen = false;
  renderModal();
};

const renderModal = () => {
  const addTaskModal = document.getElementById("add-task-modal");
  if (!addTaskModal) throw new Error("Add Task Modal not found");
  addTaskModal.style.display = modalState.isOpen ? "block" : "none"; // show modal if open else hide

  const taskTitleInput = document.getElementById("task-title");
  const taskDescriptionInput = document.getElementById("task-description");

  if (
    !isValidTextInput(taskTitleInput) ||
    !isValidTextInput(taskDescriptionInput)
  ) {
    throw new Error("Task input not found");
  }

  taskTitleInput.focus();

  const form = document.getElementById("add-task-modal-content");

  if (!form) throw new Error("Add Task Form not found");

  form.onsubmit = (e) => {
    e.preventDefault();
    if (modalState.type === "") throw new Error("Task type not found");
    const task = {
      title: taskTitleInput.value,
      description: taskDescriptionInput.value,
      type: modalState.type,
    };
    addTask(task);
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
  };
};

const renderTasks = () => {
  const columns = [...document.getElementsByClassName("column")]; // convert HTMLCollection to array

  columns.forEach((column) => {
    const taskContainerInColumn = column?.querySelector(".task-container");

    if (!taskContainerInColumn) throw new Error("Task Container not found");

    taskContainerInColumn.innerHTML = ""; // clear tasks in column

    if (isValidTaskType(column.id)) {
      const tasks = tasksState.filter((task) => task.type === column.id); // get tasks of the column type
      const tasksElements = tasks.map(createTaskElement);
      tasksElements.forEach((taskElement) => {
        taskContainerInColumn.appendChild(taskElement);
      });
    }
  });
};

const createTaskElement = (task: Task) => {
  const taskElement = document.createElement("div");
  taskElement.className = "task";
  taskElement.draggable = true;

  const title = document.createElement("h3");
  title.textContent = task.title;
  const description = document.createElement("p");
  description.textContent = task.description;
  const deleteButton = document.createElement("span");
  deleteButton.innerHTML = "&times;";
  deleteButton.className = "close-button";

  deleteButton.onclick = () => {
    if (!task.id) throw new Error("Task ID not found");
    const taskRef = doc(db, "tasks", task.id);
    deleteDoc(taskRef); // delete task from firebase
  };

  taskElement.appendChild(title);
  taskElement.appendChild(description);
  taskElement.appendChild(deleteButton);

  taskElement.addEventListener("dragstart", (e) => {
    e.dataTransfer?.setData("text/plain", JSON.stringify(task));
    taskElement.style.opacity = "0.25";
  });

  taskElement.addEventListener("dragend", () => {
    taskElement.style.opacity = "1";
  });

  return taskElement;
};

const addTask = async (task: Task) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), task); // add task to firebase
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  renderTasks(); // update html with new task

  modalState.isOpen = false;
  renderModal(); // close modal after adding task
};
