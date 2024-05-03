import { useQuery, useMutation } from 'react-query';
import { get, post, put, del } from './ApiService';

export const useFetchTasksByProjectId = (projectId) => {
    return useQuery(['tasks', projectId], () => get(`/projects/${projectId}/tasks`));
};

export const useAddTask = (projectId) => {
    return useMutation((taskData) => post(`/projects/${projectId}/tasks`, taskData));
};

export const useUpdateTask = (taskId) => {
    return useMutation((taskData) => put(`/tasks/${taskId}`, taskData));
};

export const useDeleteTask = (taskId) => {
    return useMutation(() => del(`/tasks/${taskId}`));
};