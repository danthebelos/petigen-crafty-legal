
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getUserProfile: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Erro ao recuperar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sessão encerrada",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      toast({
        variant: "destructive",
        title: "Erro ao desconectar",
        description: "Não foi possível encerrar sua sessão. Tente novamente.",
      });
    }
  };

  const getUserProfile = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      return null;
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    getUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
