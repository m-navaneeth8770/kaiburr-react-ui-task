import axios from 'axios';
import type { Task } from './types'; // <-- Change is here

// IMPORTANT: Use the URL from your `minikube service` command
const API_BASE_URL = 'http://127.0.0.1:64966'; // Use the latest URL you have

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTasks = () => apiClient.get<Task[]>('/tasks');
export const findTasksByName = (name: string) => apiClient.get<Task[]>(`/tasks/findByName?name=${name}`);
export const createTask = (task: Omit<Task, 'taskExecutions'>) => apiClient.put<Task>('/tasks', task);
export const deleteTask = (id: string) => apiClient.delete(`/tasks/${id}`);
export const executeTask = (id: string) => apiClient.put<Task>(`/tasks/${id}/executions`);