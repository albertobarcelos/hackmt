
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, Mail, Lock, AlertTriangle, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;

      setSuccess("Cadastro realizado com sucesso! Por favor, verifique seu e-mail para confirmação.");
      toast({
        title: "Conta criada",
        description: "Por favor, verifique seu e-mail para confirmação.",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      setError(err.message || "Falha ao cadastrar. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="font-bold text-center text-teal-500 text-2xl">Criar Conta</CardTitle>
        <CardDescription className="text-center">
          Cadastre-se para acessar o painel de administração
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="name" 
                placeholder="Seu nome" 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="pl-10" 
                required 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                placeholder="nome@exemplo.com" 
                type="email" 
                autoCapitalize="none" 
                autoComplete="email" 
                autoCorrect="off" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="pl-10" 
                required 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                placeholder="••••••••" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="pl-10" 
                required 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="confirmPassword" 
                placeholder="••••••••" 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                className="pl-10" 
                required 
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          <span>Já tem uma conta? </span>
          <Link to="/login" className="text-primary hover:underline font-medium">
            Entrar
          </Link>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Login
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
