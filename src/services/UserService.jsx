import { useQuery, useMutation } from 'react-query';
import { get, post, del } from './ApiService';

export const useFetchUsers = () => {
    return useQuery('users', () => get('/users'));
};

export const useFetchProjectEligibleUsers = (projectId) => {
    return useQuery(['project-eligible-users', projectId], () => get(`/projects/${projectId}/eligible-users`));
};

export const useFetchTaskEligibleUsers = (projectId, taskId) => {
    return useQuery(['task-eligible-users', projectId, taskId], () => get(`/projects/${projectId}/tasks/${taskId}/eligible-users`));
};

export const useAddUser = (userData) => {
    return useMutation(() => post('/users', userData));
};

export const useDeleteUser = (userId) => {
    return useMutation(() => del(`/users/${userId}`));
};

export const useUpdateUser = (userId, userData) => {
    return useMutation(() => put(`/users/${userId}`, userData));
};


// import { useQuery, useMutation } from 'react-query';
// import { get, post, del } from './ApiService';

// export const useFetchUsers = () => {
//     return useQuery('users', () => get('/users'));
// };

// export const useFetchProjectEligibleUsers = (projectId) => {
//     return useQuery(['project-eligible-users', projectId], () => get(`/projects/${projectId}/eligible-users`));
// };

// export const useFetchTaskEligibleUsers = (projectId, taskId) => {
//     return useQuery(['task-eligible-users', projectId, taskId], () => get(`/tasks/${taskId}/eligible-users`));
// };

// export const useAddUser = () => {
//     return useMutation((userData) => post('/users', userData));
// };

// export const useDeleteUser = () => {
//     return useMutation((userId) => del(`/users/${userId}`));
// };

// export const useUpdateUser = () => {
//     return useMutation((userData) => post(`/users/${userData.id}`, userData));
// };