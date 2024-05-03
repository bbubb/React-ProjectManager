import { useAuth, AuthProvider } from "./contexts/AuthProvider";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import { useEffect } from "react";

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
