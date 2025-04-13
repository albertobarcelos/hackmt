
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import UsersPage from "@/pages/UsersPage";
import ProfilePage from "@/pages/ProfilePage";
import MapaCalorPage from "@/pages/MapaCalorPage";
import VisitaPage from "@/pages/VisitaPage";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Importações do aplicativo mobile do ACE
import MobileAppLayout from "@/components/mobile/MobileAppLayout";
import VisitasPage from "@/pages/app-ace/VisitasPage";
import HistoricoPage from "@/pages/app-ace/HistoricoPage";
import PerfilPage from "@/pages/app-ace/PerfilPage";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/register" element={session ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
            <Route path="/forgot-password" element={session ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute session={session} />}>
              {/* Dashboard routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/mapa-calor" element={<MapaCalorPage />} />
                <Route path="/visita/:casaId" element={<VisitaPage />} />
              </Route>

              {/* Mobile app routes */}
              <Route element={<MobileAppLayout />}>
                <Route path="/app-ace" element={<VisitasPage />} />
                <Route path="/app-ace/historico" element={<HistoricoPage />} />
                <Route path="/app-ace/perfil" element={<PerfilPage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
