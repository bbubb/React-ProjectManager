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