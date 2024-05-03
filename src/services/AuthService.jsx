export const authenticateUser = async ({ username, password }) => {
  console.log("Fetching user data from server:", username);
  try {
    const response = await fetch(
      `http://localhost:3001/users?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`
    );
    const users = await response.json();
    if (users.length > 0) {
      return { isAuthenticated: true, user: users[0] };
    } else {
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data"); // Rethrow or handle differently depending on needs
  }
};

export default authenticateUser;