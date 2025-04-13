
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
import LocalizacaoPage from "@/pages/LocalizacaoPage";
import AceHistoricoPage from "@/pages/AceHistoricoPage";
import AcePerfilPage from "@/pages/AcePerfilPage";
import MapaCalorPage from "@/pages/MapaCalorPage";
import VisitaPage from "@/pages/VisitaPage";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/localizacao" element={<LocalizacaoPage />} />
                <Route path="/ace-historico" element={<AceHistoricoPage />} />
                <Route path="/ace-perfil" element={<AcePerfilPage />} />
                <Route path="/mapa-calor" element={<MapaCalorPage />} />
                <Route path="/visita/:casaId" element={<VisitaPage />} />
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
