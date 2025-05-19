import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [editingTask, setEditingTask] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    dueDate: ''
  });

  const handleEdit = (task) => setEditingTask(task);
  const handleSuccess = () => {
    setEditingTask(null);
    setRefresh(r => r + 1);
  };
  const handleCancel = () => setEditingTask(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
    setRefresh(r => r + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Task Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <select name="category" value={filters.category} onChange={handleFilterChange} className="border px-2 py-1 rounded">
            <option value="">All Categories</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Urgent">Urgent</option>
            <option value="Other">Other</option>
          </select>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="border px-2 py-1 rounded">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={filters.dueDate}
            onChange={handleFilterChange}
            className="border px-2 py-1 rounded"
            placeholder="Due Date"
          />
        </div>
        <TaskForm editingTask={editingTask} onSuccess={handleSuccess} onCancel={handleCancel} />
        <TaskList onEdit={handleEdit} refresh={refresh} filters={filters} />
      </main>
    </div>
  );
} 