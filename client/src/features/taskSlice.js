import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchTasks = createAsyncThunk('tasks/fetch', async () => {
  const res = await api.get('/tasks');
  return res.data;
});

export const addTask = createAsyncThunk('tasks/add', async (task) => {
  const res = await api.post('/tasks', task);
  return res.data;
});

export const updateTask = createAsyncThunk(
    'tasks/update',
    async ({ id, data }) => {
      const res = await api.put(`/tasks/${id}`, data);
      return res.data;                // updated task
    }
  );
  
const taskSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], status: null },
  extraReducers: (builder) => {
    builder
  .addCase(fetchTasks.fulfilled, (state, action) => {
    state.list = action.payload;
  })
  .addCase(addTask.fulfilled, (state, action) => {
    state.list.push(action.payload);
  })
  .addCase(updateTask.fulfilled, (state, action) => {
    const updatedId = action.payload?._id ?? action.payload?.id;
    const i = state.list.findIndex(
      (t) => (t?._id ?? t?.id) === updatedId
    );
    if (i !== -1) state.list[i] = action.payload;
  });

  },
});

export default taskSlice.reducer;
