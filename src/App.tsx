
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Questionnaire from "./pages/Questionnaire";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
