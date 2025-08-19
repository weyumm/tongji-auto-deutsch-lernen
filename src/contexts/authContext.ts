import { createContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
  userLevel: 1,
  experiencePoints: 0,
  updateExperience: (points: number) => {},
});