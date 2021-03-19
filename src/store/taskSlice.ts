import { createSlice } from '@reduxjs/toolkit';

export interface Task {
  running: boolean,
  name: string,
  startTime: string,
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
  }
});

export const { addTask } = taskSlice.actions;
export const selectTaskList = (state: { tasks: { taskList: Task[]; }; }) => state.tasks.taskList;
export default taskSlice.reducer;
