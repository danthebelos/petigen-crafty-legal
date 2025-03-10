
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type Advogado = {
  id: string;
  nome_completo: string;
  oab: string;
  email: string;
  foto_url?: string;
  bio?: string;
  escritorio_id: string;
};

type ProfileType = "escritorio" | "advogado";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getUserProfile: () => Promise<any>;
  advogados: Advogado[];
  loadingAdvogados: boolean;
  currentProfile: {
    type: ProfileType;
    data: Advogado | null;
  };
  switchProfile: (type: ProfileType, advogadoId?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [loadingAdvogados, setLoadingAdvogados] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<{
    type: ProfileType;
    data: Advogado | null;
  }>({
    type: "escritorio",
    data: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Carregar advogados associados ao escritório
          await loadAdvogados(session.user.id);
        }
      } catch (error) {
        console.error("Erro ao recuperar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Carregar advogados associados ao escritório
          await loadAdvogados(session.user.id);
        } else {
          // Limpar dados quando o usuário faz logout
          setAdvogados([]);
          setCurrentProfile({
            type: "escritorio",
            data: null,
          });
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadAdvogados = async (escritorioId: string) => {
    setLoadingAdvogados(true);
    try {
      const { data, error } = await supabase
        .from("advogados")
        .select("*")
        .eq("escritorio_id", escritorioId);

      if (error) throw error;
      setAdvogados(data as Advogado[] || []);
    } catch (error) {
      console.error("Erro ao carregar advogados:", error);
    } finally {
      setLoadingAdvogados(false);
    }
  };

  const switchProfile = async (type: ProfileType, advogadoId?: string) => {
    if (type === "escritorio") {
      setCurrentProfile({
        type: "escritorio",
        data: null,
      });
      
      toast({
        title: "Perfil alterado",
        description: "Você está usando o perfil do escritório agora.",
      });
      
      return;
    }
    
    if (type === "advogado" && advogadoId) {
      const advogado = advogados.find(adv => adv.id === advogadoId);
      
      if (!advogado) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Advogado não encontrado.",
        });
        return;
      }
      
      setCurrentProfile({
        type: "advogado",
        data: advogado,
      });
      
      toast({
        title: "Perfil alterado",
        description: `Você está usando o perfil de ${advogado.nome_completo} agora.`,
      });
    }
  };

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
    advogados,
    loadingAdvogados,
    currentProfile,
    switchProfile,
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
