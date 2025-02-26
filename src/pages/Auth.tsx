import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oab, setOab] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/questionnaire");
      } else {
        console.log("Iniciando processo de cadastro...");
        
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nome_completo: nomeCompleto,
              oab: oab,
            },
          },
        });
        
        if (signUpError) throw signUpError;

        if (data.user) {
          console.log("Usuário criado, enviando email de boas-vindas...");
          
          // Enviar email de boas-vindas
          const { error: welcomeEmailError } = await supabase.functions.invoke(
            "send-welcome-email",
            {
              body: { 
                user: {
                  email,
                  nome_completo: nomeCompleto,
                },
              },
            }
          );

          if (welcomeEmailError) {
            console.error("Erro ao enviar email de boas-vindas:", welcomeEmailError);
            toast({
              variant: "destructive",
              title: "Erro ao enviar email de boas-vindas",
              description: welcomeEmailError.message,
            });
          } else {
            console.log("Email de boas-vindas enviado com sucesso!");
          }

          toast({
            title: "Cadastro realizado!",
            description: "Verifique seu email para confirmar o cadastro.",
          });
        }
      }
    } catch (error) {
      console.error("Erro no processo de autenticação:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-zinc-900">
            {isLogin ? "Entre na sua conta" : "Crie sua conta"}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            {isLogin
              ? "Acesse sua conta para gerenciar suas petições"
              : "Cadastre-se para começar a usar o Petigen"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="nomeCompleto">Nome Completo</Label>
                  <Input
                    id="nomeCompleto"
                    name="nomeCompleto"
                    type="text"
                    required
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="oab">Número da OAB</Label>
                  <Input
                    id="oab"
                    name="oab"
                    type="text"
                    required
                    value={oab}
                    onChange={(e) => setOab(e.target.value)}
                    placeholder="123456/UF"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading
                ? "Carregando..."
                : isLogin
                ? "Entrar"
                : "Criar conta"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Não tem uma conta? Cadastre-se"
                : "Já tem uma conta? Entre"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
