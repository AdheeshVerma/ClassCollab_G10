import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load stored auth details on page load
    const storedToken = localStorage.getItem("cc-auth-token");
    const storedUser = localStorage.getItem("cc-user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await res.json();

      const userInfo: User = {
        username: data.user.username,
        email: data.user.email,
      };

      localStorage.setItem("cc-auth-token", data.access);
      localStorage.setItem("cc-user", JSON.stringify(userInfo));

      setToken(data.access);
      setUser(userInfo);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    // You can replace this with your actual signup logic later
    setIsLoading(true);
    try {
      const newUser: User = {
        username: name,
        email,
      };
      const mockToken = "mock-jwt-token-" + Date.now();

      localStorage.setItem("cc-auth-token", mockToken);
      localStorage.setItem("cc-user", JSON.stringify(newUser));

      setToken(mockToken);
      setUser(newUser);
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("cc-auth-token");
    localStorage.removeItem("cc-user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
