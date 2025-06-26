import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const checkAuth = async () => {
      if (!token) {
        setIsLoggedIn(false);
        setRole("");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://stayfinder-backend-trrx.onrender.com/check-auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.authenticated) {
          setIsLoggedIn(true);
          setRole(data.role || "");
          localStorage.setItem("role", data.role || "");
        } else {
          setIsLoggedIn(false);
          setRole("");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      } catch (err) {
        console.error("Auth check failed:", err.message);
        setIsLoggedIn(false);
        setRole("");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
