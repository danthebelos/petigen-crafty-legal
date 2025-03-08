
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, UserPlus, Trash2 } from "lucide-react";

type Advogado = {
  id: string;
  nome_completo: string;
  oab: string;
  email: string;
  foto_url?: string;
  bio?: string;
  escritorio_id: string;
  created_at?: string;
  updated_at?: string;
};

const AdvogadosProfiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingAdvogado, setAddingAdvogado] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  
  // Form state
  const [novoAdvogado, setNovoAdvogado] = useState({
    nome_completo: "",
    oab: "",
    email: "",
    bio: "",
  });
  const [foto, setFoto] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      carregarAdvogados();
    }
  }, [user]);

  const carregarAdvogados = async () => {
    setLoading(true);
    try {
      // Using type casting to resolve TS issues until types.ts is updated
      const { data, error } = await supabase
        .from("advogados")
        .select("*")
        .eq("escritorio_id", user?.id);

      if (error) throw error;
      setAdvogados(data as Advogado[] || []);
    } catch (error) {
      console.error("Erro ao carregar advogados:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a lista de advogados.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovoAdvogado(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFoto(e.target.files[0]);
    }
  };

  const uploadFoto = async (advogadoId: string): Promise<string | null> => {
    if (!foto) return null;
    
    setUploadingFoto(true);
    try {
      const fileExt = foto.name.split('.').pop();
      const filePath = `advogados/${advogadoId}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, foto);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível fazer o upload da foto.",
      });
      return null;
    } finally {
      setUploadingFoto(false);
    }
  };

  const adicionarAdvogado = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAdvogado(true);
    
    try {
      // Verificar se o email já existe
      const { data: existingAdvogado, error: checkError } = await supabase
        .from("advogados")
        .select("*")
        .eq("email", novoAdvogado.email)
        .single();
      
      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }
      
      if (existingAdvogado) {
        throw new Error("Este email já está cadastrado para outro advogado.");
      }
      
      // Criar advogado
      const { data, error } = await supabase
        .from("advogados")
        .insert([
          {
            nome_completo: novoAdvogado.nome_completo,
            oab: novoAdvogado.oab,
            email: novoAdvogado.email,
            bio: novoAdvogado.bio || null,
            escritorio_id: user?.id,
          } as any
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Upload da foto se houver
      if (foto && data) {
        const fotoUrl = await uploadFoto(data.id);
        if (fotoUrl) {
          const { error: updateError } = await supabase
            .from("advogados")
            .update({ foto_url: fotoUrl } as any)
            .eq("id", data.id);
          
          if (updateError) throw updateError;
          data.foto_url = fotoUrl;
        }
      }
      
      setAdvogados(prev => [...prev, data as Advogado]);
      setNovoAdvogado({
        nome_completo: "",
        oab: "",
        email: "",
        bio: "",
      });
      setFoto(null);
      
      toast({
        title: "Advogado adicionado",
        description: "O advogado foi adicionado com sucesso.",
      });
      
      setAddingAdvogado(false);
    } catch (error: any) {
      console.error("Erro ao adicionar advogado:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível adicionar o advogado.",
      });
      setAddingAdvogado(false);
    }
  };

  const removerAdvogado = async (id: string) => {
    try {
      const { error } = await supabase
        .from("advogados")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      setAdvogados(prev => prev.filter(adv => adv.id !== id));
      
      toast({
        title: "Advogado removido",
        description: "O advogado foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao remover advogado:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o advogado.",
      });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Advogados</h1>
          <Button onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Advogado
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {advogados.length === 0 ? (
              <div className="col-span-full text-center p-12 bg-zinc-50 rounded-lg">
                <UserPlus className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Nenhum advogado cadastrado</h3>
                <p className="text-zinc-500 mb-4">
                  Adicione advogados do seu escritório para gerenciar melhor sua equipe.
                </p>
                <Button onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Advogado
                </Button>
              </div>
            ) : (
              advogados.map((advogado) => (
                <Card key={advogado.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{advogado.nome_completo}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removerAdvogado(advogado.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-4">
                      <div className="min-w-24 h-24 bg-zinc-100 rounded-lg overflow-hidden">
                        {advogado.foto_url ? (
                          <img
                            src={advogado.foto_url}
                            alt={advogado.nome_completo}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-zinc-400">
                            Sem foto
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-sm font-medium text-zinc-500">OAB:</span>
                          <p>{advogado.oab}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-500">Email:</span>
                          <p>{advogado.email}</p>
                        </div>
                      </div>
                    </div>
                    {advogado.bio && (
                      <div>
                        <span className="text-sm font-medium text-zinc-500">Biografia:</span>
                        <p className="text-sm mt-1">{advogado.bio}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Adicionar Novo Advogado</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={adicionarAdvogado} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo</Label>
                <Input
                  id="nome_completo"
                  name="nome_completo"
                  value={novoAdvogado.nome_completo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oab">Número da OAB</Label>
                <Input
                  id="oab"
                  name="oab"
                  value={novoAdvogado.oab}
                  onChange={handleInputChange}
                  required
                  placeholder="123456/UF"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={novoAdvogado.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia (opcional)</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={novoAdvogado.bio}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="foto">Foto (opcional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="foto"
                    name="foto"
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="flex-1"
                  />
                  {foto && (
                    <div className="w-12 h-12 bg-zinc-100 rounded overflow-hidden">
                      <img
                        src={URL.createObjectURL(foto)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={addingAdvogado || uploadingFoto}
              >
                {(addingAdvogado || uploadingFoto) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {addingAdvogado ? "Adicionando..." : "Adicionar Advogado"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvogadosProfiles;
