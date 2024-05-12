// Project Service
import { useQuery, useMutation } from "react-query";
import { get, post, put, del } from "./ApiService";

export const useFetchProjects = () =>
  useQuery("projects", () => get("/projects"), {
    onError: (error) => console.error("Error fetching all projects:", error),
  });

export const useFetchProjectById = (projectId) =>
  useQuery(["project", projectId], () => get(`/projects/${projectId}`), {
    enabled: !!projectId,
    onError: (error) =>
      console.error("Error fetching project b y ID ${projectId}:", error),
  });

export const useFetchProjectsByUserRole = (userId) =>
  useQuery(["projects", userId], () => get(`/projects-by-user/${userId}`), {
    enabled: !!userId,
    onError: (error) => {
      console.error("Error fetching projects for user ${userId}:", error);
    },
    onSuccess: (data) => {
      console.log("Fetched projects for user ${userId}:", data);
    },
  });

export const useSaveProject = () =>
  useMutation(
    (project) => {
      const { projectId, ...projectData } = project;
      return id
        ? put(`/projects/${projectId}`, projectData)
        : post("/projects", projectData);
    },
    {
      onError: (error, variables) => {
        const action = variables.projectId ? "updating" : "creating";
        console.error(`Error ${action} project:`, error);
      },
      onSuccess: (data, variables) => {
        const action = variables.projectId ? "updated" : "created";
        console.log(`Project ${action} successfully:`, data);
      },
    }
  );

export const useDeleteProject = () =>
  useMutation((projectId) => del(`/projects/${projectId}`), {
    onError: (error, variables) => {
      console.error(`Error deleting project ${projectId}:`, error);
    },
    onSuccess: (data, variables) => {
      console.log(`Project deleted successfully:`, data);
    },
  });

export const useAddUserToProject = () =>
  useMutation(
    ({ projectId, userId, role }) =>
      post(`/projects/${projectId}/access/${role}`, { userId }),
    {
      onError: (error, { projectId, userId, role }) =>
        console.error(
          `Error adding user ${userId} with role ${role} to project ${projectId}:`,
          error
        ),
    }
  );

export const useRemoveUserFromProject = () =>
  useMutation(
    ({ projectId, userId }) => del(`/projects/${projectId}/access/${userId}`),
    {
      onError: (error, { projectId, userId }) =>
        console.error(
          `Error removing user ${userId} from project ${projectId}:`,
          error
        ),
    }
  );

export const useAddTaskToProject = (projectId, taskData) =>
  useMutation(() => post(`/projects/${projectId}/tasks`, taskData), {
    onError: (error) =>
      console.error("Error adding task to project ${projectId}:", error),
  });

export const useRemoveTaskFromProject = (projectId, taskId) =>
  useMutation(() => del(`/projects/${projectId}/tasks/${taskId}`), {
    onError: (error) =>
      console.error(
        `Error removing task ${taskId} from project ${projectId}:`,
        error
      ),
  });

export const useAssignTaskToUser = () => {
  return useMutation(
    ({ projectId, taskId, userId }) =>
      put(`/projects/${projectId}/tasks/${taskId}/assign`, { userId: userId }),
    {
      onError: (error) =>
        console.error(`Error assigning task to user in project: ${error}`),
      onSuccess: (data) =>
        console.log(`Task assignment successful: ${data.message}`),
    }
  );
};

export const useRemoveTaskUserAssignment = (projectId, taskId) =>
  useMutation(
    () => put(`/projects/${projectId}/tasks/${taskId}`, { assignee: {} }),
    {
      onError: (error) =>
        console.error(
          `Error removing task ${taskId} assignment in project ${projectId}:`,
          error
        ),
    }
  );
