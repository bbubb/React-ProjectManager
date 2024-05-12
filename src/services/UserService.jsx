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
      onError: (error) => {
        console.error(
          `Error fetching eligible users for project ${projectId}:`,
          error
        );
      },
      select: (data) => {
        if (!data || data.error) {
          throw new Error(data?.error || "An unknown error occurred");
        }
        return data;
      },
    }
  );
};

export const useFetchTaskEligibleUsers = (projectId, taskId) => {
  return useQuery(
    ["task-eligible-users", projectId, taskId],
    () => get(`/projects/${projectId}/tasks/${taskId}/eligible-users`),
    {
      enabled: !!projectId && !!taskId,
      onError: (error) =>
        console.error(
          `Error fetching eligible users for task ${taskId} in project ${projectId}:`,
          error
        ),
    }
  );
};

export const useFetchProjectUsers = (projectId) => {
  return useQuery(
    ["project-users", projectId],
    () => get(`/projects/${projectId}/users`),
    {
      enabled: !!projectId,
      onError: (error) =>
        console.error(`Error fetching users for project ${projectId}:`, error),
    }
  );
};

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