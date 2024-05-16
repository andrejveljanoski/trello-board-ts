// document methods return HTMLELement type so we need to check if the element is an input element
export const isValidTextInput = (
  inputElement: HTMLElement,
): inputElement is HTMLInputElement => {
  return (inputElement as HTMLInputElement).value !== undefined;
};

export type TaskType = "todo" | "in-progress" | "done";

export const isValidTaskType = (type: string): type is TaskType =>
  type === "todo" || type === "in-progress" || type === "done";

export type Task = {
  id?: string;
  title: string;
  description: string;
  type: TaskType;
};

export const isValidTask = (task: unknown): task is Task => {
  if (typeof task === "object" && task !== null) {
    const maybeTask = task as Task;
    return (
      maybeTask.title !== undefined &&
      maybeTask.description !== undefined &&
      isValidTaskType(maybeTask.type)
    );
  }
  return false;
};

export type TasksState = Task[];

export type ModalState = {
  type: TaskType | "";
  isOpen: boolean;
};
