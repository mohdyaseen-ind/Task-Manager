import { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/taskService';

const initialState = {
  title: '',
  description: '',
  dueDate: '',
  category: 'Personal',
  status: 'pending',
};

export default function TaskForm({ editingTask, onSuccess, onCancel }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingTask) {
      setForm({
        ...editingTask,
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(initialState);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, form);
      } else {
        await createTask(form);
      }
      onSuccess();
      setForm(initialState);
    } catch (err) {
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow mb-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input name="title" value={form.title} onChange={handleChange} required className="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
      </div>
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Due Date</label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="w-full border px-2 py-1 rounded" />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="w-full border px-2 py-1 rounded">
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Urgent">Urgent</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border px-2 py-1 rounded">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-2">
        <button type="submit" disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded">
          {editingTask ? 'Update' : 'Add'} Task
        </button>
        {editingTask && (
          <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        )}
      </div>
    </form>
  );
} 