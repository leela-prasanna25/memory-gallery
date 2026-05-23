import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { api } from "../api/client";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem("token") || "");

  const login = useCallback((newToken) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setTokenState("");
  }, []);

  const [memories, setMemories] = useState([]);

  const fetchMemories = useCallback(async () => {
    const response = await api.get("/memories");
    setMemories(response.data);
  }, []);

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
      memories,
      fetchMemories,
    }),
    [token, login, logout, memories, fetchMemories]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
