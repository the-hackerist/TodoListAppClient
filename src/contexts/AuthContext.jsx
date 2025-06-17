/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const token = localStorage.getItem("token");
const expiry = localStorage.getItem("token_expiry");

const now = new Date();
const tokenExpiry = new Date(expiry);

const isExpired = now > tokenExpiry;

if (isExpired) {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expiry");
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(token && !isExpired ? token : null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Out of bounds!");
  return context;
};

export { useAuth, AuthProvider };
