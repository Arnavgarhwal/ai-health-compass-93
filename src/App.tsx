import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DiseaseLibrary from "./pages/DiseaseLibrary";
import Medicines from "./pages/Medicines";
import Diagnostics from "./pages/Diagnostics";
import Consultations from "./pages/Consultations";
import SymptomAnalyzer from "./pages/SymptomAnalyzer";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import HealthRecords from "./pages/HealthRecords";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diseases" element={<DiseaseLibrary />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/profile" element={<ProfileSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
