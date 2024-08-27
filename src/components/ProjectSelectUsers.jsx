import { useEffect, useState } from "react";
import Select from "react-select";

const ProjectSelectUsers = ({
  projectUsersList,
  eligibleUsersList,
  userChanges,
  addUserToProject,
  removeUserFromProject,
  loadingProjectUsers,
  loadingEligibleUsers,
  setSearchQuery,
}) => {
  const [selectedAddUser, setSelectedAddUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRemoveUser, setSelectedRemoveUser] = useState(null);
  const [filteredProjectUsers, setFilteredProjectUsers] = useState([]);
  const [filteredEligibleUsers, setFilteredEligibleUsers] = useState([]);

  useEffect(() => {
    const updatedProjectUsers = projectUsersList
      .filter(
        (user) =>
          !userChanges.removedUsers.find(
            (removedUser) => removedUser.userId === user.id
          )
      )
      .concat(
        userChanges.addedUsers.map((user) => ({
          id: user.userId,
          username: user.username,
          role: user.role,
        }))
      );

    const updatedEligibleUsers = eligibleUsersList
      .filter(
        (user) =>
          !userChanges.addedUsers.find(
            (addedUser) => addedUser.userId === user.id
          )
      )
      .concat(
        userChanges.removedUsers.map((user) => ({
          id: user.userId,
          username: user.username,
        }))
      );

    setFilteredProjectUsers(updatedProjectUsers);
    setFilteredEligibleUsers(updatedEligibleUsers);
  }, [projectUsersList, eligibleUsersList, userChanges]);

  const userOptions =
    filteredProjectUsers.map((user) => ({
      value: user.id,
      label: `${user.username} (${user.role})`,
    })) || [];

  const eligibleUserOptions =
    filteredEligibleUsers.map((user) => ({
      value: user.id,
      label: user.username,
    })) || [];

  const handleAddUser = () => {
    if (selectedAddUser && selectedRole) {
      const userToAdd = {
        userId: selectedAddUser.value,
        username: selectedAddUser.label,
        role: selectedRole.value,
      };
      addUserToProject(userToAdd);
      setSelectedAddUser(null);
      setSelectedRole(null);
    } else {
      console.error("Required data missing for adding user to project");
    }
  };

  const handleRemoveUser = () => {
    if (selectedRemoveUser) {
      removeUserFromProject({
        userId: selectedRemoveUser.value,
        username: selectedRemoveUser.label,
      });
      setSelectedRemoveUser(null);
    } else {
      console.error("Required data missing for removing user from project");
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-2">
        <h3>Add User</h3>
        <input
          type="text"
          placeholder="Search users"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loadingEligibleUsers ? (
          <p>Loading eligible users...</p>
        ) : (
          <Select
            options={eligibleUserOptions}
            onChange={setSelectedAddUser}
            value={selectedAddUser}
            placeholder="Search and select user"
          />
        )}
        <Select
          options={[
            { value: "admin", label: "Admin" },
            { value: "editor", label: "Editor" },
            { value: "reader", label: "Reader" },
          ]}
          value={selectedRole}
          onChange={setSelectedRole}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <div className="flex flex-col space-y-2">
        <h3>Project Users</h3>
        {loadingProjectUsers ? (
          <p>Loading project users...</p>
        ) : (
          <Select
            options={userOptions}
            value={selectedRemoveUser}
            onChange={setSelectedRemoveUser}
          />
        )}
        <button onClick={handleRemoveUser}>Remove User</button>
      </div>
    </div>
  );
};

export default ProjectSelectUsers;
