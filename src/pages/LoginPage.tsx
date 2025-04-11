
import React from "react";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Admin Portal</h1>
        <p className="text-slate-600">Sign in to access your dashboard</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
