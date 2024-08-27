import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSaveProject } from "../services/ProjectService";
import {
  useFetchProjectEligibleUsers,
  useFetchProjectUsers,
} from "../services/UserService";
import { useAuth } from "./AuthProvider";
import { useProject } from "./ProjectProvider";

const ProjectEditContext = createContext();

const ProjectEditProvider = ({ children }) => {
  const { user } = useAuth();
  const globalUser = user || {};
  const { selectedProject, handleShowProjectInput, refetchProjects, handleSelectProject } =
    useProject();
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    description: "",
    date: "",
  });
  const [originalDetails, setOriginalDetails] = useState(projectDetails);
  const [userChanges, setUserChanges] = useState({
    addedUsers: [],
    removedUsers: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: projectUsers,
    isLoading: loadingUsers,
    isError: usersError,
    error: usersErrorDetails,
  } = useFetchProjectUsers(selectedProject?.id);
  const {
    data: eligibleUsers,
    isLoading: loadingEligibleUsers,
    isError: eligibleUsersError,
    error: eligibleUsersErrorDetails,
  } = useFetchProjectEligibleUsers(selectedProject?.id, searchQuery);
  const {
    mutate: saveProject,
    isLoading: savingProject,
    isError: saveError,
    error: saveErrorDetails,
  } = useSaveProject();

  useEffect(() => {
    if (selectedProject && projectUsers) {
      setProjectDetails({
        name: selectedProject.name,
        description: selectedProject.description,
        date: selectedProject.date,
      });
      setOriginalDetails({
        name: selectedProject.name,
        description: selectedProject.description,
        date: selectedProject.date,
      });
    }
  }, [selectedProject, projectUsers]);

  const handleDetailChanges = useCallback((e) => {
    const { name, value } = e.target;
    setProjectDetails((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addUserToProject = useCallback((userToAdd) => {
    setUserChanges((prev) => ({
      ...prev,
      addedUsers: [...prev.addedUsers, userToAdd],
      removedUsers: prev.removedUsers.filter(
        (u) => u.userId !== userToAdd.userId
      ),
    }));
  }, []);

  const removeUserFromProject = useCallback((userToRemove) => {
    setUserChanges((prev) => ({
      ...prev,
      removedUsers: [...prev.removedUsers, userToRemove],
      addedUsers: prev.addedUsers.filter(
        (u) => u.userId !== userToRemove.userId
      ),
    }));
  }, []);

  const handleSaveProject = useCallback(() => {
    const projectPayload = {
      projectId: selectedProject ? selectedProject.id : undefined,
      ...projectDetails,
      userChanges,
      globalUserId: globalUser.id,
    };

    saveProject(projectPayload, {
      onError: (error) => {
        console.error("Error saving project:", error);
      },
      onSuccess: (data) => {
        console.log("Project saved successfully:", data);
        refetchProjects();
        handleShowProjectInput(false);
        console.log("Selected Project:", selectedProject);
        handleSelectProject(data.project.id);
        console.log("Data project selected:", data.project.id);
      },
    });
  }, [
    projectDetails,
    userChanges,
    selectedProject,
    saveProject,
    globalUser,
    handleShowProjectInput,
    handleSelectProject,
    refetchProjects,
  ]);

  const handleCancelProject = useCallback(() => {
    setProjectDetails(originalDetails);
    setUserChanges({ addedUsers: [], removedUsers: [] });
    handleShowProjectInput(false);
  }, [originalDetails, handleShowProjectInput]);

  const projectUsersList = projectUsers?.allProjectUsers || [];
  const eligibleUsersList = eligibleUsers?.eligibleUsers || [];

  return (
    <ProjectEditContext.Provider
      value={{
        projectDetails,
        handleDetailChanges,
        addUserToProject,
        removeUserFromProject,
        handleSaveProject,
        handleCancelProject,
        userChanges,
        projectUsersList,
        loadingUsers,
        usersError,
        usersErrorDetails,
        loadingEligibleUsers,
        eligibleUsersList,
        eligibleUsersError,
        eligibleUsersErrorDetails,
        savingProject,
        saveError,
        saveErrorDetails,
        setSearchQuery,
      }}
    >
      {children}
    </ProjectEditContext.Provider>
  );
};

export const useProjectEdit = () => useContext(ProjectEditContext);

export default ProjectEditProvider;
