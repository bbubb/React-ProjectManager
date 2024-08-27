// Project Service
import { useMutation, useQuery } from "react-query";
import { del, get, post, put } from "./ApiService";

export const useFetchProjects = () =>
  useQuery("projects", () => get("/projects"), {
    onError: (error) => console.error(`Error fetching all projects:`, error),
  });

export const useFetchProjectById = (projectId) =>
  useQuery(["project", projectId], () => get(`/projects/${projectId}`), {
    enabled: !!projectId,
    onError: (error) =>
      console.error(`Error fetching project b y ID ${projectId}:`, error),
  });

export const useFetchProjectsByUserRole = (userId) =>
  useQuery(
    ["projects-by-user", userId],
    () => get(`/projects-by-user/${userId}`),
    {
      enabled: !!userId,
      onError: (error) => {
        console.error(`Error fetching projects for user ${userId}:`, error);
      },
      onSuccess: (data) => {
        console.log(`Fetched projects for user ${userId}:`, data);
      },
    }
  );

export const useSaveProject = () =>
  useMutation((projectPayload) => {
    const { projectId, name, description, date, userChanges, globalUserId } =
      projectPayload;

    return projectId
      ? put(`/projects/${projectId}`, {
          name,
          description,
          date,
          userChanges,
        })
      : post("/projects", {
          name,
          description,
          date,
          userChanges,
          globalUserId,
        });
  });

export const useDeleteProject = () =>
  useMutation((projectId) => del(`/projects/${projectId}`), {
    onError: (error) => {
      console.error(`Error deleting project ${projectId}:`, error);
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

export const useAddTaskToProject = () => {
  return useMutation(
    ({ projectId, taskDescription }) =>
      post(`/projects/${projectId}/tasks`, { description: taskDescription }),
    {
      onError: (error) =>
        console.error(`Error adding task to project ${projectId}:`, error),
    }
  );
};

export const useRemoveTaskFromProject = () => {
  return useMutation(
    ({ projectId, taskId }) => del(`/projects/${projectId}/tasks/${taskId}`),
    {
      onError: (error) =>
        console.error(
          `Error removing task ${taskId} from project ${projectId}:`,
          error
        ),
    }
  );
};

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
