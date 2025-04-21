
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
    // Check if user is already logged in
    const storedToken = localStorage.getItem("cc-auth-token");
    const storedUser = localStorage.getItem("cc-user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Mock login function (will be replaced with actual API calls later)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock successful login
      const mockUser = {
        id: "user-123",
        name: "John Doe",
        email: email,
        avatar: "",
      };
      const mockToken = "mock-jwt-token";

      // Store in local storage
      localStorage.setItem("cc-auth-token", mockToken);
      localStorage.setItem("cc-user", JSON.stringify(mockUser));

      // Update state
      setUser(mockUser);
      setToken(mockToken);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock successful signup
      const mockUser = {
        id: "user-" + Date.now(),
        name: name,
        email: email,
        avatar: "",
      };
      const mockToken = "mock-jwt-token-" + Date.now();

      // Store in local storage
      localStorage.setItem("cc-auth-token", mockToken);
      localStorage.setItem("cc-user", JSON.stringify(mockUser));

      // Update state
      setUser(mockUser);
      setToken(mockToken);
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
