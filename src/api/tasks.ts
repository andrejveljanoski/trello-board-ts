import { onSnapshot, collection } from "firebase/firestore";
import { tasksState } from "../state";
import { isValidTask } from "../types";
import { db } from "./firebase";

export const getTasksAndUpdateState = (renderTasks: () => void) =>
  onSnapshot(collection(db, "tasks"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const task = {
        id: change.doc.id,
        ...change.doc.data(),
      };
      if (!isValidTask(task)) {
        throw new Error("Invalid Task");
      }
      switch (change.type) {
        case "added":
          tasksState.push(task);
          break;
        case "modified":
          const index = tasksState.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            tasksState[index] = task;
          }
          break;
        case "removed":
          const indexToRemove = tasksState.findIndex((t) => t.id === task.id);
          if (indexToRemove !== -1) {
            tasksState.splice(indexToRemove, 1);
          }
          break;
      }
    });
    renderTasks();
  });
 