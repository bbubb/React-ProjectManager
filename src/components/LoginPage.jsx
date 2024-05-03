import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading } = useAuth();

  const handleLogin = (event) => {
    event.preventDefault();
    signIn({ username, password });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className="h-screen flex items-center justify-center">
      <div className="w-3/4 max-w-4x1 text-xl md:text-2xl font-semibold">
        <h1 className="text-center text-4xl my-8">
          Welcome to Project Manager
        </h1>
        <p className="text-center text-xl my-8">Please log in to continue</p>
        <form className="flex justify-center items-center flex-col gap-4">
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="max-w-md min-w-max bg-stone-200 rounded-md text-stone-500 font-semibold border-b-2 border-stone-300 focus:border-stone-600 outline-none p-2"
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="max-w-md min-w-max bg-stone-200 rounded-md text-stone-500 font-semibold border-b-2 border-stone-300 focus:border-stone-600 outline-none p-2"
          />
          <button
            onClick={handleLogin}
            className="max-w-sx min-w-max px-4 py-2 bg-stone-800 text-stone-100 rounded-md hover:bg-stone-600 focus:bg-stone-900 focus:text-stone-200"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
