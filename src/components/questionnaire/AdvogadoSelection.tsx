
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
import { usePeticaoContext } from "./PeticaoContext";

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
  const { user, advogados, loadingAdvogados, currentProfile } = useAuth();
  const { selectedAdvogado, setSelectedAdvogado } = usePeticaoContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Set the default value based on currentProfile if it's an advogado
  useEffect(() => {
    if (currentProfile.type === "advogado" && currentProfile.data) {
      form.setValue("advogadoId", currentProfile.data.id);
      
      // Find the selected advogado in the advogados array
      const foundAdvogado = advogados.find(adv => adv.id === currentProfile.data.id);
      
      if (foundAdvogado) {
        setSelectedAdvogado(foundAdvogado as any);
      }
    }
  }, [currentProfile, advogados, form, setSelectedAdvogado]);

  // Update the selectedAdvogado when the form value changes
  useEffect(() => {
    const advogadoId = form.watch("advogadoId");
    
    if (advogadoId) {
      const foundAdvogado = advogados.find(adv => adv.id === advogadoId);
      
      if (foundAdvogado) {
        setSelectedAdvogado(foundAdvogado as any);
      }
    }
  }, [form.watch("advogadoId"), advogados, setSelectedAdvogado]);

  const handleCadastrarAdvogado = () => {
    navigate("/advogados");
  };

  // If currentProfile is an advogado, don't show selection
  if (currentProfile.type === "advogado") {
    return (
      <div className="space-y-4">
        <FormLabel>Advogado Selecionado</FormLabel>
        <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
          {currentProfile.data?.foto_url ? (
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img
                src={currentProfile.data.foto_url}
                alt={currentProfile.data.nome_completo}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {currentProfile.data?.nome_completo.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium">{currentProfile.data?.nome_completo}</p>
            <p className="text-sm text-muted-foreground">{currentProfile.data?.oab}</p>
          </div>
        </div>
        <input 
          type="hidden" 
          {...form.register("advogadoId")} 
          value={currentProfile.data?.id} 
        />
      </div>
    );
  }

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

      {loadingAdvogados ? (
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
