
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building2, UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocation } from "react-router-dom";

type ProfileData = {
  id: string;
  nome_completo: string;
  oab: string;
};

const Profile = () => {
  const { user, currentProfile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const message = (location.state as any)?.message;
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    nome_completo: "",
    oab: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  useEffect(() => {
    // Show message if redirected with one
    if (message) {
      toast({
        title: "Aviso",
        description: message,
      });
    }
  }, [message, toast]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfileData({
          id: data.id,
          nome_completo: data.nome_completo || "",
          oab: data.oab || "",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados do perfil",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          nome_completo: profileData.nome_completo,
          oab: profileData.oab,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Perfis</h1>
        
        {message && (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Escritório Profile Card */}
          <Card className={`border-2 ${currentProfile.type === "escritorio" ? "border-primary" : "border-transparent"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                Escritório
              </CardTitle>
              <CardDescription>
                Perfil principal do escritório
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{profileData.nome_completo || "Nome do Escritório"}</p>
                  {profileData.oab && (
                    <p className="text-sm text-muted-foreground">OAB: {profileData.oab}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                
                {currentProfile.type === "escritorio" ? (
                  <div className="bg-primary/10 text-primary text-xs font-medium py-1 px-2 rounded-md inline-block">
                    Perfil Ativo
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.location.reload()}
                  >
                    Alterar para este perfil
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Current advogado profile if active */}
          {currentProfile.type === "advogado" && currentProfile.data && (
            <Card className="border-2 border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                  Advogado
                </CardTitle>
                <CardDescription>
                  Perfil ativo de advogado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {currentProfile.data.foto_url ? (
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img
                          src={currentProfile.data.foto_url}
                          alt={currentProfile.data.nome_completo}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {currentProfile.data.nome_completo.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{currentProfile.data.nome_completo}</p>
                      <p className="text-sm text-muted-foreground">OAB: {currentProfile.data.oab}</p>
                      <p className="text-sm text-muted-foreground">{currentProfile.data.email}</p>
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 text-primary text-xs font-medium py-1 px-2 rounded-md inline-block">
                    Perfil Ativo
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
          <h2 className="text-xl font-bold mb-6">Dados do Escritório</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                O email não pode ser alterado
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nome_completo">Nome do Escritório</Label>
              <Input
                id="nome_completo"
                value={profileData.nome_completo}
                onChange={(e) => setProfileData({...profileData, nome_completo: e.target.value})}
                placeholder="Nome do seu escritório"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="oab">Número da OAB do Escritório (se aplicável)</Label>
              <Input
                id="oab"
                value={profileData.oab}
                onChange={(e) => setProfileData({...profileData, oab: e.target.value})}
                placeholder="123456/UF"
              />
            </div>
            
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
