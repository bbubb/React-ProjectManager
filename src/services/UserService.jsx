// User Service
import { useQuery, useMutation } from "react-query";
import { get, post, del } from "./ApiService";

export const useFetchUsers = () => {
  return useQuery("users", () => get("/users"), {
    onError: (error) => console.error("Error fetching all users:", error),
  });
};

export const useFetchProjectEligibleUsers = (projectId) => {
  return useQuery(
    ["project-eligible-users", projectId],
    () => get(`/projects/${projectId}/eligible-users`),
    {
      enabled: !!projectId,
      onError: (error) =>
        console.error(
          `Error fetching eligible users for project ${projectId}:`,
          error
        ),
    }
  );
};

export const useFetchTaskEligibleUsers = (projectId, taskId) =>
  useQuery(
    ["task-eligible-users", projectId, taskId],
    () =>
      get(
        `/projects/${projectId}/tasks/${taskId}/eligible-users`
      ),
    {
      enabled: !!projectId && !!taskId,
      onError: (error) =>
        console.error(
          `Error fetching eligible users for task ${taskId} in project ${projectId}:`,
          error
        ),
    }
  );

export const useAddUser = (userData) => {
  return useMutation(() => post("/users", userData), {
    onError: (error) => console.error("Error adding user:", error),
  });
};

export const useDeleteUser = (userId) => {
  return useMutation(() => del(`/users/${userId}`), {
    onError: (error) => console.error(`Error deleting user ${userId}:`, error),
  });
};

export const useUpdateUser = (userId, userData) => {
  return useMutation(() => put(`/users/${userId}`, userData), {
    onError: (error) => console.error(`Error updating user ${userId}:`, error),
  });
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
