import { useRemoveUserFromProject } from "../services/ProjectService";
import { useProject } from "../contexts/ProjectProvider";
import { useFetchProjectUsers } from "../services/UserService";
import Select from "react-select";
import { useState, useEffect } from "react";
import { useQueryClient } from "react-query";

const ProjectRemoveUser = () => {
  const { selectedProject } = useProject();
  const queryClient = useQueryClient();
  const {
    data: users,
    isLoading: loadingUsers,
    isError: usersError,
    error: usersErrorDetails,
  } = useFetchProjectUsers(selectedProject?.id);
  const removeUserFromProject = useRemoveUserFromProject();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    if (users && users.allProjectUsers) {
      const options = users.allProjectUsers.map((user) => ({
        value: user.id,
        label: user.username,
      }));
      setUserOptions(options);
    }
  }, [users]);

  const handleRemoveUser = () => {
    if (selectedUser && selectedProject) {
      removeUserFromProject.mutate(
        {
          projectId: selectedProject.id,
          userId: selectedUser.value,
        },
        {
          onSuccess: () => {
            console.log("queryClient", queryClient);
            queryClient.invalidateQueries([
              "project-users",
              selectedProject.id,
            ]);
            queryClient.invalidateQueries([
              "project-eligible-users",
              selectedProject.id,
            ]);
            setSelectedUser(null);
          },
          onError: (error) => {
            console.error("Failed to remove user from project:", error);
          },
        }
      );
    } else {
      console.error("Required data missing for removing user from project");
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Select
        options={userOptions}
        onChange={setSelectedUser}
        value={selectedUser}
        placeholder="Select User"
        isLoading={loadingUsers}
        isDisabled={loadingUsers || !userOptions.length || !selectedProject}
      />
      <span className="text-red-500 text-sm">
        {usersError && usersErrorDetails.message}
      </span>
      <button
        className="bg-stone-300 hover:bg-red-500 rounded-md font-semibold px-4 py-2 focus:bg-red-800 text-stone-800 focus:text-stone-50"
        onClick={handleRemoveUser}
      >
        Remove User
      </button>
    </div>
  );
};

export default ProjectRemoveUser;
