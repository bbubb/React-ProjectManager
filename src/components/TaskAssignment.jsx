// TaskAssignment
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useProject } from "../contexts/ProjectProvider";
import { useAssignTaskToUser } from "../services/ProjectService";
import { useFetchTaskEligibleUsers } from "../services/UserService";

const TaskAssignment = ({ taskId }) => {
  const { selectedProject } = useProject();
  const {
    data: users,
    isLoading: loadingUsers,
    isError: usersError,
    error: errorDetails,
  } = useFetchTaskEligibleUsers(selectedProject?.id, taskId);
  const assignMutation = useAssignTaskToUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [options, setOptions] = useState([]);

  console.log("Selected Project:", selectedProject.id, "Task ID:", taskId);
  console.log("Eligible Task Users:", users);

  useEffect(() => {
    if (users && users.eligibleUsers) {
      const userOptions = users.eligibleUsers.map((user) => ({
        value: user.id,
        label: user.username,
      }));

      setOptions(userOptions);

      if (users.assignee && users.assignee.userId !== null) {
        const assigneeOption = userOptions.find(
          (option) => option.value === users.assignee.userId
        );
        setSelectedUser(assigneeOption);
      } else {
        setSelectedUser(null);
      }
    }
  }, [users]);

  const handleAssign = () => {
    if (selectedUser) {
      console.log(
        `Assigning task ${taskId} to user ${selectedUser.value} in project ${selectedProject.id}`
      );
      assignMutation.mutate({
        projectId: selectedProject.id,
        taskId: taskId,
        userId: selectedUser ? selectedUser.value : null,
      });
    }
  };

  const handleClear = () => {
    setSelectedUser("");
    assignMutation.mutate({
      projectId: selectedProject.id,
      taskId: taskId,
      userId: null,
    });
  };

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedUser(selectedOption);
    } else {
      setSelectedUser(null);
    }
  };

  return (
    <div className="flex flex-row text-base md:text-lg space-x-2">
      <Select
        options={options}
        onChange={handleSelectChange}
        value={selectedUser}
        placeholder="Select User"
        isLoading={loadingUsers}
        isDisabled={loadingUsers || usersError}
      />
      <button
        className="hover:bg-stone-400 rounded-md font-semibold px-4 py-2 focus:bg-stone-800 text-stone-800 focus:text-stone-50"
        onClick={handleAssign}
        disabled={usersError || assignMutation.isLoading}
      >
        Assign
      </button>
      {assignMutation.isLoading && <span>Assigning...</span>}
      {usersError && (
        <span className="text-red-500">{errorDetails?.message}</span>
      )}
      <button
        className="px-4 py-2 hover:bg-red-700 rounded-md"
        onClick={handleClear}
      >
        Clear
      </button>
    </div>
  );
};

export default TaskAssignment;
