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
<<<<<<< HEAD
        const res = await fetch("https://stayfinder-backend-trrx.onrender.com/check-auth", {
          credentials: "include",
=======
        const res = await fetch("http://localhost:8000/check-auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
>>>>>>> 13a6fdf (add crypto)
        });

        const data = await res.json();

        if (res.ok && data.authenticated) {
          setIsLoggedIn(true);
          setRole(data.role);
        } else {
          setIsLoggedIn(false);
          setRole("");
          localStorage.removeItem("token"); // Clean up expired token
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
        setRole("");
        localStorage.removeItem("token");
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
