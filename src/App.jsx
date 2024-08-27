import { useEffect } from "react";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import { useAuth } from "./contexts/AuthProvider";

function App() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log("App - User updated:", user);
  }, [user]);

  console.log("User:", user);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">{!user ? <LoginPage /> : <Dashboard />}</div>
  );
}

export default () => <App />;
