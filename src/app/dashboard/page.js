'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../firebase/config';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  Box,
  Button,
  Checkbox,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check user login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch tasks
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));

    const unsubscribeTasks = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => unsubscribeTasks();
  }, [user]);

  // Add new task
  const handleAddTask = async () => {
    if (!taskInput.trim() || !user) return;

    await addDoc(collection(db, 'tasks'), {
      task: taskInput,
      completed: false,
      userId: user.uid,
      createdAt: Date.now(),
    });

    setTaskInput('');
  };

  // Mark task complete
  const markTaskComplete = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        completed: !currentStatus,
      });
    } catch (e) {
      console.error('Error updating task: ', e);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (e) {
      console.error('Error deleting task: ', e);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (e) {
      console.error('Error logging out:', e);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h6" align="center">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.paper' }}>

        {/* Profile Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <img 
              src={user?.photoURL} 
              alt="Profile Pic" 
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <Typography variant="h6">{user?.displayName}</Typography>
          </Box>
          
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {/* Add Task */}
        <Box display="flex" gap={2} mt={3} mb={4}>
          <TextField
            fullWidth
            label="Enter a new task"
            variant="outlined"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
          />
          <Button variant="contained" onClick={handleAddTask}>Add</Button>
        </Box>

        {/* Task List */}
        {tasks.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
            No tasks found. Start by adding one!
          </Typography>
        ) : (
          <List>
            {tasks.map((task) => (
              <ListItem
                key={task.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="complete" onClick={() => markTaskComplete(task.id, task.completed)}>
                      <Checkbox
                        edge="end"
                        checked={task.completed}
                      />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'text.disabled' : 'text.primary',
                  }}
                >
                  {task.task}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}
