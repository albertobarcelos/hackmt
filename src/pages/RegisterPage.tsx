
import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Portal do Admin</h1>
        <p className="text-slate-600">Crie uma conta para acessar o painel</p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
