import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import backend from "~backend/client";
import { googleClientId } from "../config";

interface User {
  userID: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  getAuthenticatedBackend: () => typeof backend;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("google_token")
  );
  const [isLoading, setIsLoading] = useState(false);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", token],
    queryFn: async () => {
      if (!token) return null;
      const authenticatedBackend = backend.with({
        auth: () => ({ authorization: `Bearer ${token}` })
      });
      return await authenticatedBackend.auth.getUserInfo();
    },
    enabled: !!token,
    retry: false,
  });

  const signIn = async () => {
    if (!googleClientId) {
      throw new Error("Google Client ID not configured");
    }

    setIsLoading(true);
    
    try {
      // Load Google Identity Services
      await new Promise<void>((resolve, reject) => {
        if (window.google) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
        document.head.appendChild(script);
      });

      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: any) => {
          setToken(response.credential);
          localStorage.setItem("google_token", response.credential);
          setIsLoading(false);
        },
      });

      // Prompt for sign-in
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error("Sign-in failed:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = () => {
    setToken(null);
    localStorage.removeItem("google_token");
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const getAuthenticatedBackend = () => {
    if (!token) return backend;
    return backend.with({
      auth: () => ({ authorization: `Bearer ${token}` })
    });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || isUserLoading,
        isAuthenticated,
        signIn,
        signOut,
        getAuthenticatedBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Extend the Window interface to include Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}
