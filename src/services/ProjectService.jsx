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

export const useAddProject = () =>
  useMutation((data) => post("/projects", data), {
    onError: (error) => console.error("Error adding project:", error),
  });

export const useUpdateProject = (projectId, data) =>
  useMutation(() => put(`/projects/${projectId}`, data), {
    onError: (error) =>
      console.error("Error updating project ${projectId}:", error),
  });

export const useDeleteProject = (projectId) =>
  useMutation(() => del(`/projects/${projectId}`), {
    onError: (error) =>
      console.error("Error deleting project ${projectId}:", error),
  });

export const useAddUserToProject = (projectId, userId, role) =>
  useMutation(() => post(`/projects/${projectId}/access/${role}`, { userId }), {
    onError: (error) =>
      console.error(
        "Error adding user ${userId} with role ${role} to project ${projectId}:",
        error
      ),
  });

export const useRemoveUserFromProject = (projectId, userId, role) =>
  useMutation(() => del(`/projects/${projectId}/access/${role}/${userId}`), {
    onError: (error) =>
      console.error(
        "Error removing user ${userId} with role ${role} from project ${projectId}:",
        error
      ),
  });

export const useAddTaskToProject = (projectId, taskData) =>
  useMutation(() => post(`/projects/${projectId}/tasks`, taskData), {
    onError: (error) =>
      console.error("Error adding task to project ${projectId}:", error),
  });

export const useRemoveTaskFromProject = (projectId, taskId) =>
  useMutation(() => del(`/projects/${projectId}/tasks/${taskId}`), {
    onError: (error) =>
      console.error(
        "Error removing task ${taskId} from project ${projectId}:",
        error
      ),
  });

  export const useAssignTaskToUser = () => {
    return useMutation(({ projectId, taskId, userId }) =>
      put(`/projects/${projectId}/tasks/${taskId}/assign`, { userId: userId }),
      {
        onError: (error) =>
          console.error(
            `Error assigning task to user in project: ${error}`
          ),
        onSuccess: (data) =>
          console.log(`Task assignment successful: ${data.message}`)
      }
    );
  };  

export const useRemoveTaskUserAssignment = (projectId, taskId) =>
  useMutation(
    () => put(`/projects/${projectId}/tasks/${taskId}`, { assignee: {} }),
    {
      onError: (error) =>
        console.error(
          "Error removing task ${taskId} assignment in project ${projectId}:",
          error
        ),
    }
  );