
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, Mail, Lock, AlertTriangle, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSuccess("Login bem-sucedido!");
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta ao painel de administração!"
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err: any) {
      console.error("Erro de login:", err);
      setError(err.message || "Email ou senha inválidos. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="font-bold text-center text-teal-500 text-2xl">Login Administrador</CardTitle>
        <CardDescription className="text-center">
          Entre com suas credenciais para acessar o painel de administração
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
        <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                placeholder="••••••••" 
                type="password" 
                autoComplete="current-password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="pl-10" 
                required 
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          <span>Não tem uma conta? </span>
          <Link to="/register" className="text-primary hover:underline font-medium">
            Registre-se agora
          </Link>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/register">
            <UserPlus className="mr-2 h-4 w-4" />
            Criar Conta
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
