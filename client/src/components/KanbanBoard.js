import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import { updateTask } from '../features/taskSlice';
// Add MUI imports for UI polish
import { Paper, Box, Typography, IconButton, Collapse, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const columns = ['ToDo', 'In Progress', 'Done'];

/**
 * KanbanBoard
 * @param {Array} tasks – already‑filtered tasks passed from Dashboard
 * @param {string} openId – id of the currently expanded card
 * @param {function} setOpenId – function to set openId
 * @param {function} onEdit – function to call for editing a task
 */
export default function KanbanBoard({ tasks, openId, setOpenId, onEdit }) {
  const dispatch = useDispatch();
  const getTaskId = (t) => String(t?._id ?? t?.id ?? '');
  const getAssigneeName = (t) => t?.assignee?.name ?? t?.assigneeName ?? 'unassigned';
  const getCreatorName = (t) => t?.creator?.name ?? t?.creatorName ?? 'unknown';

  const onDragEnd = (result) => {
    const { draggableId, destination, source } = result;
    if (!destination) return;                                  // dropped outside
    if (destination.droppableId === source.droppableId) return; // same column

    const newStatus = destination.droppableId;
    dispatch(updateTask({ id: draggableId, data: { status: newStatus } }));
  };

  const now = new Date();
  const three = 3 * 24 * 60 * 60 * 1000;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        {columns.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  flex: 1,
                  minWidth: 260,
                  minHeight: '60vh',
                  p: 1,
                  bgcolor: '#e3ecfa',
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography variant="h6" align="center" color="#205081" mb={1}>{col}</Typography>

                {tasks
                  .filter((t) => t.status === col)
                  .map((t, index) => {
                    const taskId = getTaskId(t);
                    if (!taskId) return null;

                    // Deadline highlight
                    const isDeadlineSoon = t.dueDate && (new Date(t.dueDate) - now < three) && (new Date(t.dueDate) - now > 0);
                    return (
                      <Draggable draggableId={taskId} index={index} key={taskId}>
                        {(prov) => (
                          <Paper
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            sx={{
                              p: 1.5,
                              mb: 1,
                              bgcolor: '#fafcff',
                              border: openId === taskId ? '2px solid #1976d2' : '1px solid #ddd',
                              borderRadius: 2,
                              boxShadow: openId === taskId ? 4 : 1,
                              cursor: 'pointer',
                              transition: 'box-shadow 0.2s, border 0.2s',
                            }}
                            onClick={() => setOpenId(openId === taskId ? null : taskId)}
                          >
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Typography fontWeight={600} color="#205081">{t.title}</Typography>
                              <IconButton size="small" color="primary" onClick={e => { e.stopPropagation(); onEdit(t); }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            {/* Due date chip with calendar icon and color */}
                            <Chip
                              icon={<CalendarTodayIcon fontSize="small" />}
                              label={t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'}
                              size="small"
                              sx={{
                                bgcolor: isDeadlineSoon ? '#ffebee' : '#e3ecfa',
                                color: isDeadlineSoon ? '#d32f2f' : '#205081',
                                mt: 0.5,
                                mb: 0.5,
                              }}
                            />
                            <Collapse in={openId === taskId} timeout="auto" unmountOnExit>
                              <Box mt={1}>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                                  {t.description || '— no description —'}
                                </Typography>
                                <Box display="flex" gap={1} flexWrap="wrap">
                                  <Chip label={`Assigned to: ${getAssigneeName(t)}`} size="small" />
                                  <Chip label={`Assigned by: ${getCreatorName(t)}`} size="small" />
                                </Box>
                              </Box>
                            </Collapse>
                          </Paper>
                        )}
                      </Draggable>
                    );
                  })}

                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
}
