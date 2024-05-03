import { useState } from "react";
import { useProject } from "../contexts/ProjectProvider";
import Select from "react-select";

const UserAndRoleAssignment = () => {
  const {
    selectedProject,
    handleAddRoleToUser,
    getAssignableUsers,
    getAssignableRoles,
  } = useProject();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const usersOptions = (getAssignableUsers ? getAssignableUsers : []).map(
    (user) => ({
      value: user.id,
      label: user.username,
    })
  );

  const roleOptions = (
    selectedUser && getAssignableRoles ? getAssignableRoles(selectedUser) : []
  ).map((role) => ({
    value: role,
    label: role,
  }));

  const handleSubmit = () => {
    if (selectedUser && selectedRole) {
      handleAddRoleToUser(selectedUser.value, selectedRole.value);
    }
  };

  return (
    <div>
      <Select
        options={usersOptions}
        onChange={setSelectedUser}
        placeholder="Select User"
      />
      <Select
        options={roleOptions}
        onChange={setSelectedRole}
        placeholder="Select Role"
      />
      <button onClick={handleSubmit}>Add User</button>
    </div>
  );
};

export default UserAndRoleAssignment;
