import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import LevelsPage from "@/pages/levels/Page";
import KnowledgeGraphPage from "@/pages/knowledge-graph/Page";
import SkillsPage from "@/pages/skills/Page";
import LevelPage from "@/pages/game/LevelPage";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/levels" element={<LevelsPage />} />
        <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
        <Route path="/skills/:skillType" element={<SkillsPage />} />
        <Route path="/game/level/:levelId" element={<LevelPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}
