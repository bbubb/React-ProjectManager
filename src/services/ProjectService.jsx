import { useQuery, useMutation } from "react-query";
import { get, post, put, del } from "./ApiService";

export const useFetchProjects = () =>
  useQuery("projects", () => get("/projects"));

export const useFetchProjectById = (projectId) =>
  useQuery(["project", projectId], () => get(`/projects/${projectId}`));

export const useFetchProjectsByUserRole = (userId) =>
  useQuery(["projects", userId], () => get(`/projects`, { userId }));

export const useAddProject = () =>
  useMutation((data) => post("/projects", data));

export const useUpdateProject = (projectId, data) =>
  useMutation(() => put(`/projects/${projectId}`, data));

export const useDeleteProject = (projectId) =>
  useMutation(() => del(`/projects/${projectId}`));

export const useAddUserToProject = (projectId, userId, role) =>
  useMutation(() => post(`/projects/${projectId}/access/${role}`, { userId }));

export const useRemoveUserFromProject = (projectId, userId, role) =>
  useMutation(() => del(`/projects/${projectId}/access/${role}/${userId}`));

export const useAddTaskToProject = (projectId, taskData) =>
  useMutation(() => post(`/projects/${projectId}/tasks`, taskData));

export const useRemoveTaskFromProject = (projectId, taskId) =>
  useMutation(() => del(`/projects/${projectId}/tasks/${taskId}`));

export const useAssignTaskToUser = (projectId, taskId, userId) =>
  useMutation(() =>
    put(`/projects/${projectId}/tasks/${taskId}`, { assignee: { userId } })
  );

export const useRemoveTaskUserAssignment = (projectId, taskId) =>
  useMutation(() =>
    put(`/projects/${projectId}/tasks/${taskId}`, { assignee: {} })
  );

// // ProjectService
// import { useQuery, useMutation } from 'react-query';
// import { get, post, put, del } from './ApiService';

// export const useFetchProjects = () => {
//     return useQuery('projects', () => get('/projects'));
// };

// export const useFetchProjectById = (projectId) => {
//     return useQuery(['project', projectId], () => get(`/projects/${projectId}`));
// };

// export const useFetchProjectsByUserRole = (userId) => {
//     return useQuery(['projects', userId], () => get('/projects'));
// }

// export const useAddProject = () => {
//     return useMutation(data => post('/projects', data));
// };

// export const useUpdateProject = (projectId, data) => {
//     return useMutation(() => put(`/projects/${projectId}`, data));
// };

// export const useDeleteProject = (projectId) => {
//     return useMutation(() => del(`/projects/${projectId}`));
// };

// export const useAddUserToProject = (projectId, accessRole, userId) => {
//     return useMutation(() => post(`/projects/${projectId}/access/`, { userId }));
// };

// export const useRemoveUserFromProject = (projectId, userId) => {
//     return useMutation(() => del(`/projects/${projectId}/access/${userId}`));
// };

// // Task operations as part of projects
// export const useAddTaskToProject = (projectId, taskData) => {
//     return useMutation(() => post(`/projects/${projectId}/tasks`, taskData));
// };

// export const useRemoveTaskFromProject = (projectId, taskId) => {
//     return useMutation(() => del(`/projects/${projectId}/tasks/${taskId}`));
// };

// export const useAssignTaskToUser = (projectId, taskId, userId) => {
//     return useMutation(() => post(`/projects/${projectId}/tasks/${taskId}/users`, { userId }));
// };

// export const useRemoveTaskUserAssignment = (projectId, taskId, userId) => {
//     return useMutation(() => del(`/projects/${projectId}/tasks/${taskId}/users/${userId}`));
// };
