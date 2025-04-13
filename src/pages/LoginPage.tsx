
import React from "react";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative" 
      style={{
        backgroundImage: `url('/lovable-uploads/9ebfe8d2-72ff-45bb-9a97-326f8411ac56.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="w-full max-w-md mb-8 text-center z-10 relative">
        <h1 className="text-3xl font-extrabold text-white mb-2">Visita Agíl</h1>
        <p className="text-white/80">Entre para acessar seu painel</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
