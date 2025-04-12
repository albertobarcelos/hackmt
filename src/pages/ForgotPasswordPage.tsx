
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, Mail, ArrowLeft, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess("Email de redefinição de senha enviado. Por favor, verifique sua caixa de entrada.");
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para o link de redefinição de senha",
      });
    } catch (err: any) {
      console.error("Erro na redefinição de senha:", err);
      setError(err.message || "Falha ao enviar email de redefinição. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Redefinir Senha</h1>
        <p className="text-slate-600">Enviaremos um link para redefinir sua senha</p>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-teal-500">Esqueceu a Senha</CardTitle>
          <CardDescription className="text-center">
            Digite seu endereço de email e enviaremos um link para redefinir sua senha
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
          <form onSubmit={handleResetPassword} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Link de Redefinição"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" asChild>
            <Link to="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
