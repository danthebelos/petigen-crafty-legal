
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Loader2, UserPlus } from "lucide-react";
import { FormValues } from "@/types/questionnaire";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Advogado = {
  id: string;
  nome_completo: string;
  oab: string;
  email: string;
  foto_url?: string;
  bio?: string;
  escritorio_id: string;
};

const AdvogadoSelection = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const { user } = useAuth();
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      carregarAdvogados();
    }
  }, [user]);

  const carregarAdvogados = async () => {
    setLoading(true);
    try {
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

  const handleCadastrarAdvogado = () => {
    navigate("/advogados");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Selecione o Advogado</FormLabel>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCadastrarAdvogado}
          className="text-xs"
        >
          <UserPlus className="h-3 w-3 mr-1" />
          Cadastrar Advogados
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : advogados.length === 0 ? (
        <div className="text-center p-4 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground mb-2">
            Nenhum advogado cadastrado. Cadastre advogados para selecionar.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCadastrarAdvogado}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Cadastrar Advogados
          </Button>
        </div>
      ) : (
        <FormField
          control={form.control}
          name="advogadoId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um advogado" />
                  </SelectTrigger>
                  <SelectContent>
                    {advogados.map((advogado) => (
                      <SelectItem key={advogado.id} value={advogado.id}>
                        <div className="flex items-center gap-2">
                          {advogado.foto_url ? (
                            <div className="h-6 w-6 rounded-full overflow-hidden">
                              <img
                                src={advogado.foto_url}
                                alt={advogado.nome_completo}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                              {advogado.nome_completo.charAt(0)}
                            </div>
                          )}
                          <span>{advogado.nome_completo} - {advogado.oab}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default AdvogadoSelection;
