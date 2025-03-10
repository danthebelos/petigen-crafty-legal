
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PeticaoProvider } from "@/components/questionnaire/PeticaoContext";

import Index from "./pages/IndexUpdated";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Questionnaire from "./pages/Questionnaire";
import NotFound from "./pages/NotFound";
import ContractGenerator from "./pages/ContractGenerator";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import AdvogadosProfiles from "./pages/AdvogadosProfiles";

function App() {
  return (
    <AuthProvider>
      <PeticaoProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advogados"
              element={
                <ProtectedRoute>
                  <AdvogadosProfiles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questionnaire"
              element={
                <ProtectedRoute>
                  <Questionnaire />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contracts"
              element={
                <ProtectedRoute>
                  <ContractGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </PeticaoProvider>
    </AuthProvider>
  );
}

export default App;
