import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { fetchTasks } from '../features/taskSlice';
import TaskForm from '../components/TaskForm';
import KanbanBoard from '../components/KanbanBoard';
// MUI imports
import {
  Box, Button, Chip, Container, Fade, Grid, IconButton, MenuItem, Modal, Select, Tab, Tabs, Typography, useMediaQuery, useTheme, Paper, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/authSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const tasks    = useSelector((s) => s.tasks.list);
  const token    = useSelector((s) => s.auth.token);
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const getTaskId = (t) => String(t?._id ?? t?.id ?? '');
  const getAssigneeId = (t) =>
    String(t?.assignee?._id ?? t?.assignee?.id ?? t?.assigneeId ?? t?.assignee_id ?? t?.assignee ?? '');
  const getCreatorId = (t) =>
    String(t?.creator?._id ?? t?.creator?.id ?? t?.creatorId ?? t?.creator_id ?? t?.creator ?? '');
  const getAssigneeName = (t) => t?.assignee?.name ?? t?.assigneeName ?? 'unassigned';
  const getCreatorName = (t) => t?.creator?.name ?? t?.creatorName ?? 'unknown';

  /* ───────── derived user id ───────── */
  const userId = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.user.id;
    } catch {
      return null;
    }
  }, [token]);

  /* ───────── local UI state ───────── */
  const [bucket, setBucket] = useState('toMe'); // 'toMe' | 'byMe'
  const [status, setStatus] = useState('All');  // All | ToDo | In Progress | Done
  const [dead3d, setDead3d] = useState(false);  // deadline ≤ 3 days
  const [view, setView]     = useState('list'); // list | board
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [openId,   setOpenId]   = useState(null); // description toggle

  /* ───────── fetch tasks on mount ───────── */
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  /* ───────── filtered list for List view ───────── */
  const now   = new Date();
  const three = 3 * 24 * 60 * 60 * 1000;

  const filtered = tasks.filter((t) => {
    const currentUserId = String(userId || '');

    /* bucket filter */
    if (bucket === 'toMe' && getAssigneeId(t) !== currentUserId) return false;
    if (bucket === 'byMe' && getCreatorId(t) !== currentUserId) return false;

    /* status filter */
    if (status !== 'All' && t.status !== status) return false;

    /* deadline filter */
    if (dead3d && t.dueDate) {
      const diff = new Date(t.dueDate) - now;
      if (diff > three || diff < 0) return false;
    }
    return true;
  });

  /* ───────── helpers ───────── */
  const handleNew = () => { setEditing(null); setShowForm(true); };
  const handleEdit = (task) => { setEditing(task); setShowForm(true); };
  const handleEditKanban = (task) => { setEditing(task); setShowForm(true); };

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  /* ───────── render ───────── */
  return (
    <Box sx={{ bgcolor: '#f4f8fb', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight={700} color="#205081" textAlign="center">
            Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ fontWeight: 600, borderRadius: 2, ml: 2 }}
          >
            Logout
          </Button>
        </Box>

        {/* Top Controls */}
        <Paper elevation={2} sx={{ mb: 3, p: 2, borderRadius: 3, bgcolor: '#e3ecfa' }}>
          <Grid container spacing={1} alignItems="center" justifyContent="space-between" flexWrap="wrap">
            {/* Bucket Tabs */}
            <Grid item xs={12} sm="auto">
              <Tabs
                value={bucket}
                onChange={(_, v) => setBucket(v)}
                textColor="primary"
                indicatorColor="primary"
                sx={{ minHeight: 36 }}
              >
                <Tab icon={<AssignmentIndIcon />} iconPosition="start" label="Assigned to me" value="toMe" sx={{ minHeight: 36 }} />
                <Tab icon={<AssignmentIcon />} iconPosition="start" label="Assigned by me" value="byMe" sx={{ minHeight: 36 }} />
              </Tabs>
            </Grid>

            {/* Status Select */}
            <Grid item xs={6} sm="auto">
              <Select
                size="small"
                value={status}
                onChange={e => setStatus(e.target.value)}
                sx={{ bgcolor: 'white', minWidth: 120 }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="ToDo">ToDo</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </Grid>

            {/* Deadline Filter */}
            <Grid item xs={6} sm="auto">
              <Tooltip title="Show tasks with deadline in 3 days">
                <Chip
                  icon={<CalendarTodayIcon />}
                  label="≤ 3 days"
                  color={dead3d ? 'primary' : 'default'}
                  variant={dead3d ? 'filled' : 'outlined'}
                  onClick={() => setDead3d(!dead3d)}
                  sx={{ cursor: 'pointer', fontWeight: 500 }}
                />
              </Tooltip>
            </Grid>

            {/* View Toggle */}
            <Grid item xs={6} sm="auto">
              <Button
                variant={view === 'list' ? 'contained' : 'outlined'}
                color="primary"
                startIcon={<ListIcon />}
                onClick={() => setView('list')}
                sx={{ mr: 1, minWidth: 40 }}
              >
                {isMobile ? '' : 'List'}
              </Button>
              <Button
                variant={view === 'board' ? 'contained' : 'outlined'}
                color="primary"
                startIcon={<ViewKanbanIcon />}
                onClick={() => setView('board')}
                sx={{ minWidth: 40 }}
              >
                {isMobile ? '' : 'Board'}
              </Button>
            </Grid>

            {/* New Task */}
            <Grid item xs={12} sm="auto" sx={{ textAlign: { xs: 'right', sm: 'right' } }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleNew}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                {isMobile ? '' : 'New Task'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Content Area */}
        <Fade in>
          <Box>
            {view === 'list' ? (
              <Box>
                {filtered.length === 0 ? (
                  <Typography color="#205081" textAlign="center" mt={4}>No tasks match this view.</Typography>
                ) : (
                  <Grid container spacing={2}>
                    {filtered.map((t) => {
                      const taskId = getTaskId(t);
                      // Color for status
                      let statusColor = '#b0c4de';
                      if (t.status === 'ToDo') statusColor = '#e3f0ff';
                      if (t.status === 'In Progress') statusColor = '#fffbe3';
                      if (t.status === 'Done') statusColor = '#e3ffe7';
                      // Border color for expanded
                      let borderColor = 'none';
                      if (openId === taskId) {
                        if (t.status === 'ToDo') borderColor = '#1976d2';
                        if (t.status === 'In Progress') borderColor = '#fbc02d';
                        if (t.status === 'Done') borderColor = '#388e3c';
                      }
                      // Deadline highlight for date chip
                      const isDeadlineSoon = t.dueDate && (new Date(t.dueDate) - now < three) && (new Date(t.dueDate) - now > 0);
                      return (
                        <Grid item xs={12} key={taskId || `${t.title}-${t.dueDate || 'no-date'}`}>
                          <Fade in timeout={500}>
                            <Paper
                              elevation={2}
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                bgcolor: statusColor,
                                border: borderColor === 'none' ? 'none' : `2px solid ${borderColor}`,
                                transition: 'box-shadow 0.3s, border 0.3s',
                                cursor: 'pointer',
                              }}
                              onClick={() => setOpenId(openId === taskId ? null : taskId)}
                            >
                              <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                  <Typography variant="h6" color="#205081" fontWeight={600}>{t.title}</Typography>
                                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                    <Chip
                                      label={t.status}
                                      color={t.status === 'Done' ? 'success' : t.status === 'In Progress' ? 'warning' : 'default'}
                                      size="small"
                                    />
                                    <Chip
                                      label={bucket === 'toMe' ? `from ${getCreatorName(t)}` : `to ${getAssigneeName(t)}`}
                                      size="small"
                                      sx={{ bgcolor: '#e3ecfa', color: '#205081' }}
                                    />
                                    <Chip
                                      icon={<CalendarTodayIcon fontSize="small" />}
                                      label={t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'}
                                      size="small"
                                      sx={{ bgcolor: isDeadlineSoon ? '#ffebee' : '#e3ecfa', color: isDeadlineSoon ? '#d32f2f' : '#205081' }}
                                    />
                                  </Box>
                                </Box>
                                <IconButton color="primary" onClick={e => { e.stopPropagation(); handleEdit(t); }}>
                                  <EditIcon />
                                </IconButton>
                              </Box>
                              {/* Description */}
                              <Fade in={openId === taskId} unmountOnExit>
                                <Box mt={1} ml={1} sx={{ whiteSpace: 'pre-wrap' }}>
                                  {openId === taskId && (t.description || '— no description —')}
                                </Box>
                              </Fade>
                            </Paper>
                          </Fade>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            ) : (
              <KanbanBoard
                tasks={filtered}
                openId={openId}
                setOpenId={setOpenId}
                onEdit={handleEditKanban}
              />
            )}
          </Box>
        </Fade>

        {/* Modal Form */}
        <Modal
          open={showForm}
          onClose={() => setShowForm(false)}
          closeAfterTransition
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Fade in={showForm}>
            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, minWidth: isMobile ? '90vw' : 400, boxShadow: 24 }}>
              <TaskForm
                task={editing}
                onClose={() => setShowForm(false)}
              />
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
}
