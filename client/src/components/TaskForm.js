import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, fetchTasks } from '../features/taskSlice';
import { fetchUsers } from '../features/usersSlice';
// MUI imports
import {
  Box, Typography, TextField, Select, MenuItem, Button, Stack, InputLabel, FormControl
} from '@mui/material';

/**
 * TaskForm
 * @param {object|null} task   – if provided, the task to edit; otherwise create‑mode
 * @param {function}    onClose – callback to hide the modal
 */
export default function TaskForm({ task = null, onClose }) {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.users.list);
  const getId = (obj) => obj?._id ?? obj?.id ?? '';
  const assigneeOptions = users
    .map((u) => ({ id: String(getId(u)), name: u.name || 'Unknown' }))
    .filter((u) => u.id);

  /* ───────── form state ───────── */
  const [form, setForm] = useState(
    task
      ? {
          title: task.title || '',
          description: task.description || '',
          dueDate: (task.dueDate || task.due_date || '').slice(0, 10),
          priority: task.priority || 'Low',
          status: task.status || 'ToDo',
          assignee:
            getId(task.assignee) ||
            task.assigneeId ||
            task.assignee_id ||
            task.assignee ||
            '',
        }
      : {
          title: '',
          description: '',
          dueDate: '',
          priority: 'Low',
          assignee: '',
          status: 'ToDo',
        }
  );

  /* ───────── load users for dropdown ───────── */
  useEffect(() => {
    if (!users.length) dispatch(fetchUsers());
  }, [users.length, dispatch]);

  /* ───────── handlers ───────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'assignee' ? String(value) : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    /* basic client‑side validation */
    if (!form.title || !form.dueDate || !form.assignee) {
      return alert('Title, Due Date, and Assignee are required.');
    }

    const payload = {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate,
      priority: form.priority,
      assignee: String(form.assignee),
      status: form.status,
    };

    if (task) {
      await dispatch(updateTask({ id: task._id || task.id, data: payload }));
    } else {
      await dispatch(addTask(payload));
    }

    /* refresh list so Dashboard shows latest */
    dispatch(fetchTasks());
    onClose();
  };

  /* ───────── UI ───────── */
  return (
    <Box
      sx={{
        bgcolor: '#f4f8fb',
        borderRadius: 3,
        p: 3,
        minWidth: { xs: '90vw', sm: 400 },
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" fontWeight={700} color="#205081" mb={2} textAlign="center">
        {task ? 'Edit Task' : 'New Task'}
      </Typography>

      <Box component="form" onSubmit={onSubmit} autoComplete="off">
        <Stack spacing={2}>
          <TextField
            name="title"
            label="Title"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          />

          <TextField
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
            multiline
            minRows={2}
            fullWidth
            variant="outlined"
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          />

          <TextField
            name="dueDate"
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          />

          <FormControl fullWidth sx={{ bgcolor: 'white', borderRadius: 2 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={form.priority}
              label="Priority"
              onChange={handleChange}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ bgcolor: 'white', borderRadius: 2 }}>
            <InputLabel id="assignee-label">Assignee</InputLabel>
            <Select
              labelId="assignee-label"
              name="assignee"
              value={String(form.assignee || '')}
              label="Assignee"
              onChange={handleChange}
              renderValue={(selected) => {
                if (!selected) return '-- Assign to --';
                const found = assigneeOptions.find((u) => u.id === String(selected));
                return found?.name || '-- Assign to --';
              }}
              required
            >
              <MenuItem value="">-- Assign to --</MenuItem>
              {assigneeOptions.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ bgcolor: 'white', borderRadius: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={form.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="ToDo">ToDo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ fontWeight: 600, borderRadius: 2, minWidth: 100 }}
            >
              {task ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={onClose}
              sx={{ fontWeight: 600, borderRadius: 2, minWidth: 100 }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
