import axios from 'axios';

const API_URL = 'http://localhost:5001/api/tasks';

export const getTasks = async (params) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const createTask = async (task) => {
  const res = await axios.post(API_URL, task);
  return res.data;
};

export const updateTask = async (id, updates) => {
  const res = await axios.put(`${API_URL}/${id}`, updates);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
}; 