import { useState, useEffect } from "react";
import { useProject } from "../contexts/ProjectProvider";
import { useFetchProjectEligibleUsers } from "../services/UserService";
import { useAddUserToProject } from "../services/ProjectService";
import Select from "react-select";
import { useQueryClient } from "react-query";

const ProjectAddUser = ({ handleCancel }) => {
  const { selectedProject } = useProject();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const queryClient = useQueryClient();
  const {
    data: users,
    isLoading: loadingUsers,
    isError: usersError,
    error: errorDetails,
    refetch: refetchUsers,
  } = useFetchProjectEligibleUsers(selectedProject?.id);
  const addUserToProject = useAddUserToProject();

  console.log("Selected Project:", selectedProject.id);
  console.log("Eligible Project Users:", users);

  const [userOptions, setUserOptions] = useState([]);
  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "reader", label: "Reader" },
  ];

  useEffect(() => {
    if (users?.eligibleUsers) {
      const options = users.eligibleUsers.map((user) => ({
        value: user.id,
        label: user.username,
      }));
      setUserOptions(options);
    }
  }, [users]);

  const handleSubmit = () => {
    if (selectedProject && selectedUser && selectedRole) {
      addUserToProject.mutate(
        {
          projectId: selectedProject.id,
          userId: selectedUser.value,
          role: selectedRole.value,
        },
        {
          onSuccess: () => {
            console.log(
              "User added to project successfully, invalidating queries for project ID:",
              selectedProject.id
            );
            queryClient.invalidateQueries([
              "project-eligible-users",
              selectedProject.id,
            ]);
            queryClient.invalidateQueries([
              "project-users",
              selectedProject.id,
            ]);
            setSelectedUser(null);
            setSelectedRole(null);
          },
          onError: (error) => {
            console.error("Error adding user to project:", error);
          },
        }
      );
    } else {
      console.error("Required data missing for adding user to project");
    }
  };

  handleCancel = () => {
    setSelectedUser(null);
    setSelectedRole(null);
  };

  return (
    <div className="flex flex-col space-y-2">
      <Select
        options={userOptions}
        onChange={setSelectedUser}
        value={selectedUser}
        placeholder="Select User"
        isLoading={loadingUsers}
        isDisabled={
          loadingUsers ||
          !userOptions.length ||
          addUserToProject.isLoading ||
          addUserToProject.isError
        }
      />
      <Select
        options={roleOptions}
        onChange={setSelectedRole}
        value={selectedRole}
        placeholder="Select Role"
        isLoading={loadingUsers}
        isDisabled={
          loadingUsers ||
          !userOptions.length ||
          addUserToProject.isLoading ||
          addUserToProject.isError
        }
      />
      <div className="text-red-500 text-sm">
        {addUserToProject.isError && addUserToProject.error.message}
      </div>
      <div className="flex flex-col space-y-4">
        <button
          className="bg-stone-300 hover:bg-stone-400 rounded-md font-semibold px-4 py-2 focus:bg-stone-800 text-stone-800 focus:text-stone-50"
          onClick={handleSubmit}
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default ProjectAddUser;
