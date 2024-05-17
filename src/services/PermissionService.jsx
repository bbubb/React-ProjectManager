// PermissionService.js
import { useFetchProjectById } from "./ProjectService";
import { useAuth } from "../contexts/AuthProvider";

export const usePermission = (projectId) => {
  const { user } = useAuth();
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useFetchProjectById(projectId);

  const checkPermission = (role) => {
    if (isLoading || isError || !project) return false;
    return project?.access[role]?.includes(user?.id);
  };

  return {
    canEdit: checkPermission("editor") || checkPermission("admin"),
    canView:
      checkPermission("reader") ||
      checkPermission("editor") ||
      checkPermission("admin"),
    canDelete: checkPermission("admin"),
    canAssign: checkPermission("admin"),
    isLoading,
    isError,
    error,
  };
};