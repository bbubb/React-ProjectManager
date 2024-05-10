// AuthProvider
import React, { createContext, useContext } from "react";
import { useMutation, useQueryClient } from 'react-query';
import authenticateUser from "../services/AuthService";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { mutate: signIn, isLoading, error } = useMutation(authenticateUser, {
    onSuccess: (data) => {
      if (data.isAuthenticated) {
        queryClient.setQueryData('user', data.user);
      } else {
        queryClient.setQueryData('user', null);
      }
    },
    onError: () => {
      queryClient.setQueryData('user', null);
    }
  });

  const signOut = () => {
    queryClient.setQueryData('user', null);
  };

  const user = queryClient.getQueryData('user');
  console.log('User:', user);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const signIn = async (username, password) => {
//     console.log('Attempt sign in with:', username, password);
//     setIsLoading(true);
//     try {
//       const authResult = await login(username, password);
//       if (authResult.isAuthenticated) {
//         setUser(authResult.user);
//       } else {
//         // Handle failed login
//         setUser(null);
//       }
//     } catch (error) {
//       // Handle error
//       console.error("Login failed:", error);
//       setUser(null); // Optionally reset user on error
//     }
//     setIsLoading(false);
//   };

//   const signOut = () => {
//     setUser(null);
//   };

//   const login = async (username, password) => {
//     console.log('Fetching user data from server:', username);
//     try {
//       const response = await fetch(`http://localhost:3001/users?username=${username}&password=${password}`);
//       const users = await response.json();
//       console.log('Fetch response:', users);
//       if (users.length > 0) {
//         // Authentication successful
//         console.log(users[0]);
//         console.log('User is authenticated');
//         return { isAuthenticated: true, user: users[0] };
//       } else {
//         // Authentication failed
//         console.log('Failed login attempt');
//         return { isAuthenticated: false };
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       return { isAuthenticated: false };
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
