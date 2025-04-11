
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

interface ProtectedRouteProps {
  session: Session | null;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  session,
  redirectPath = "/login",
}) => {
  if (!session) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
