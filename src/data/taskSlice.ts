import { createSlice } from "@reduxjs/toolkit";
import remoteControl from "../net/remoteControl";

export type ResourceType = "机床" | "人员" | "设备";

interface Process {
  start: string;
  end: string;
  process_id: string;
  amount: number;
}

export type TaskResult = {
  [type in ResourceType]?: {
    [name: string]: Process[];
  };
};

export interface Task {
  running: boolean;
  name: string;
  startTime: string;
  result?: TaskResult[];
}

interface State {
  tasks: {
    taskList: Task[];
  };
}

export const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    taskList: [] as Task[],
  },
  reducers: {
    addTask: (state, action) => {
      for (let task of state.taskList) {
        if (task.name === action.payload.name)
          return;
      }
      state.taskList.push(action.payload);
    },
    updateTaskStatus: (state, action) => {
      let payload = action.payload;
      console.log(payload);
      for (let task of state.taskList) {
        if (task.name === payload.name) {
          task.running = payload.running;
          task.startTime = payload.startTime;
        }
      }
    },
    setResult: (state, action) => {
      let payload = action.payload;
      for (let task of state.taskList) {
        if (task.name === payload.name) task.result = payload.result;
      }
    },
  },
});

export const { addTask, updateTaskStatus } = taskSlice.actions;
export const selectTaskList = (state: State) => state.tasks.taskList;
export const selectTaskResult = (state: State) => (name: string) => {
  for (let task of state.tasks.taskList) {
    if (task.name === name) return task.result;
  }
};
export const selectTaskStatus = (state: State) => (name: string) => {
  for (let task of state.tasks.taskList) {
    if (task.name === name) return task.running;
  }
  return true;
};
export default taskSlice.reducer;
