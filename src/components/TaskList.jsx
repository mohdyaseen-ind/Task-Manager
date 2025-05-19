import { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../services/taskService';

export default function TaskList({ onEdit, refresh }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
    fetchTasks();
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!tasks.length) return <div>No tasks found.</div>;

  return (
    <ul className="space-y-2">
      {tasks.map(task => (
        <li key={task._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <div className="font-semibold">{task.title}</div>
            <div className="text-sm text-gray-500">{task.category} | {task.status}</div>
            {task.dueDate && <div className="text-xs text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</div>}
            <div className="text-gray-700 mt-1">{task.description}</div>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => onEdit(task)} className="px-2 py-1 bg-primary-500 text-white rounded">Edit</button>
            <button onClick={() => handleDelete(task._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
} 