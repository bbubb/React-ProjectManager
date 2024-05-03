import React, { useState, useEffect, useContext } from "react";
import { useProject } from "../contexts/ProjectProvider";
import Select from "react-select";

const TaskAssignment = ({ taskId }) => {
  console.log("TaskAssignment taskId:", taskId);
  const { fetchTaskEligibleUsers, selectedProject } =
    useProject();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    if (selectedProject && taskId) {
      const fetchUsers = async () => {
        try {
          console.log ("selectedProject.id:", selectedProject.id, "taskId:", taskId);
          const users = await getEligibleUsersForTask(
            selectedProject.id,
            taskId
          );
          const options = users.map((user) => ({
            value: user.id,
            label: user.username,
          }));
          setUserOptions(options);
          setSelectedUser(options.length > 0 ? options[0] : null);
        } catch (error) {
          console.error("Error fetching eligible users:", error);
          setUserOptions([]);
          setSelectedUser(null);
        }
      };

      fetchUsers();
      console.log("project:", selectedProject, "taskId:", taskId);
    }
  }, [selectedProject, taskId, getEligibleUsersForTask]);

  const handleAssign = async () => {
    if (selectedUser && selectedProject && taskId) {
      try {
        await assignUserToTask(selectedProject.id, taskId, selectedUser.value);
        alert("Task assigned successfully!");
      } catch (error) {
        alert("Failed to assign task: " + error.message);
      }
    } else {
      alert("No user selected or available for assignment!");
    }
  };

  return (
    <div className="flex flex-row text-base md:text-lg space-x-2">
      <Select
        options={userOptions}
        onChange={setSelectedUser}
        value={selectedUser}
        placeholder="User"
        getOptionValue={(option) => option.value}
        getOptionLabel={(option) => option.label}
      />
      <button onClick={handleAssign} disabled={!selectedUser}>
        Assign
      </button>
    </div>
  );
};

export default TaskAssignment;

// import { useProject } from "../contexts/ProjectProvider";
// import Select from "react-select";
// import { useState, useEffect } from "react";

// const TaskAssignment = ({ taskId }) => {
//   const { handleAssignTask, getEligibleUsersForTask } = useProject();
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [usersOptions, setUsersOptions] = useState([]);

//   useEffect(() => {
//     const users = getEligibleUsersForTasks(task.id);
//     const options = users.map((user) => ({
//       value: user.id,
//       label: user.username,
//     }));
//     setUsersOptions(options);
//     setSelectedUser(options.length > 0 ? options[0] : null); // Select first user by default
//   }, [taskId, getEligibleUsersForTask]);

//   const handleAssign = () => {
//     if (selectedUser) {
//       handleAssignTask(taskId, selectedUser.value);
//       alert("Task assigned successfully!");
//     } else {
//       alert("No user selected or available for assignment!");
//     }
//   };

//   return (
//     <div>
//       <Select
//         options={usersOptions}
//         onChange={setSelectedUser}
//         value={selectedUser}
//         placeholder="Select User to Assign"
//       />
//       <button onClick={handleAssign} disabled={!selectedUser}>
//         Assign Task
//       </button>
//     </div>
//   );
// };

// export default TaskAssignment;
