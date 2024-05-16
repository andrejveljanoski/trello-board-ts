// document methods return HTMLELement type so we need to check if the element is an input element
export const isValidTextInput = (
  inputElement: any,
): inputElement is HTMLInputElement => {
  return inputElement.value !== undefined;
};

export type TaskType = "todo" | "in-progress" | "done";

export const isValidTaskType = (type: any): type is TaskType =>
  type === "todo" || type === "in-progress" || type === "done";

export type Task = {
  id?: string;
  title: string;
  description: string;
  type: TaskType;
};

export const isValidTask = (task: any): task is Task =>
  task.title !== undefined &&
  task.description !== undefined &&
  task.type !== undefined;

export type TasksState = Task[];

export type ModalState = {
  type: TaskType | "";
  isOpen: boolean;
};
