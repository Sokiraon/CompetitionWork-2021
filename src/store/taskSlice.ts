import { createSlice } from '@reduxjs/toolkit';

export interface TaskResult {
  order_id: string;
  product_id: string;
  product_seq: number;
  semi_product_id: string;
  process_id: string;
  start_time: string;
  end_time: string;
  resource_types: string;
  resource_demands: string;
}

export interface Task {
  running: boolean;
  name: string;
  startTime: string;
  result?: TaskResult[];
}

interface State {
  tasks: {
    taskList: Task[];
  }
}

export const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    taskList: [] as Task[],
  },
  reducers: {
    addTask: (state, action) => {
      state.taskList.push(action.payload);
    },
    updateTaskStatus: (state, action) => {
      let payload = action.payload;
      for (let task of state.taskList) {
        if (task.name === payload.name)
          task.running = payload.running;
      }
    },
    setResult: (state, action) => {
      let payload = action.payload;
      for (let task of state.taskList) {
        if (task.name === payload.name)
          task.result = payload.result;
      }
    },
  }
});

export const { addTask } = taskSlice.actions;
export const selectTaskList = (state: State) => state.tasks.taskList;
export const selectTaskResult = (state: State) => (name: string) => {
  for (let task of state.tasks.taskList) {
    if (task.name === name)
      return task.result;
  }
}
export default taskSlice.reducer;
