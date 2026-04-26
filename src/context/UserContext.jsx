import { createContext, useContext, useState, useMemo } from "react";
import api from "../api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const register = async (data) => {
    const res = await api.post("/users/register", data);
    return res.data;
  };

  const login = async (data) => {
    const res = await api.post("/users/login", data);
    const { access: newToken, user: newUser } = res.data;
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setUser(newUser);
    return res.data;
  };

  const value = useMemo(() => ({
    token,
    user,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  }), [token, user]); // re-computes when token or user changes

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);