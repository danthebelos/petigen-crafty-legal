
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

interface TipoPeticaoStepProps {
  form: UseFormReturn<FormValues>;
}

const TipoPeticaoStep = ({ form }: TipoPeticaoStepProps) => {
  const tipoSelecionado = form.watch("tipo");

  // Redefinir as verbas quando o tipo de petição mudar
  useEffect(() => {
    if (tipoSelecionado !== "trabalhista") {
      form.setValue("verbas", undefined);
    } else if (!form.getValues("verbas")) {
      // Inicializar com valores padrão se for trabalhista
      form.setValue("verbas", {
        ferias: false,
        decimoTerceiro: false,
        fgts: false,
        multaRescisoria: false,
        avisoPrevio: false,
        horasExtras: false,
        danoMoral: false,
      });
    }
  }, [tipoSelecionado, form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tipo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Petição</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de petição" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="trabalhista">Trabalhista</SelectItem>
                <SelectItem value="indenizatoria">Cível (Indenizatória)</SelectItem>
                <SelectItem value="divorcio">Divórcio</SelectItem>
                <SelectItem value="habeas-corpus">Habeas Corpus</SelectItem>
                <SelectItem value="execucao">Execução de Título Extrajudicial</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {tipoSelecionado === "trabalhista" && (
        <div className="mt-6 space-y-4">
          <FormLabel>Verbas Trabalhistas Solicitadas</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="verbas.ferias"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <div 
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border ${field.value ? 'bg-primary border-primary' : 'border-primary'} cursor-pointer`} 
                    onClick={() => field.onChange(!field.value)}
                  >
                    {field.value && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                  <label 
                    className="text-sm font-medium leading-none cursor-pointer"
                    onClick={() => field.onChange(!field.value)}
                  >
                    Férias + 1/3
                  </label>
                </div>
              )}
            />
            
            <FormField
              control={form.control}
              name="verbas.decimoTerceiro"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <div 
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border ${field.value ? 'bg-primary border-primary' : 'border-primary'} cursor-pointer`}
                    onClick={() => field.onChange(!field.value)}
                  >
                    {field.value && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                  <label
                    className="text-sm font-medium leading-none cursor-pointer"
                    onClick={() => field.onChange(!field.value)}
                  >
                    13º Salário
                  </label>
                </div>
              )}
            />
            
            <FormField
              control={form.control}
              name="verbas.fgts"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <div 
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border ${field.value ? 'bg-primary border-primary' : 'border-primary'} cursor-pointer`}
                    onClick={() => field.onChange(!field.value)}
                  >
                    {field.value && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                  <label
                    className="text-sm font-medium leading-none cursor-pointer"
                    onClick={() => field.onChange(!field.value)}
                  >
                    FGTS
                  </label>
                </div>
              )}
            />
            
            <FormField
              control={form.control}
              name="verbas.multaRescisoria"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <div 
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border ${field.value ? 'bg-primary border-primary' : 'border-primary'} cursor-pointer`}
                    onClick={() => field.onChange(!field.value)}
                  >
                    {field.value && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                  <label
                    className="text-sm font-medium leading-none cursor-pointer"
                    onClick={() => field.onChange(!field.value)}
                  >
                    Multa Rescisória (40% FGTS)
                  </label>
                </div>
              )}
            />
            
            <FormField
              control={form.control}
              name="verbas.avisoPrevio"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <div 
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border ${field.value ? 'bg-primary border-primary' : 'border-primary'} cursor-pointer`}
                    onClick={() => field.onChange(!field.value)}
                  >
                    {field.value && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                  <label
                    className="text-sm font-medium leading-none cursor-pointer"
                    onClick={() => field.onChange(!field.value)}
                  >
                    Aviso Prévio
                  </label>
                </div>
              )}
            />
            
            <FormField
              control={form.control}
              name="verbas.horasExtras"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <div 
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border ${field.value ? 'bg-primary border-primary' : 'border-primary'} cursor-pointer`}
                    onClick={() => field.onChange(!field.value)}
                  >
                    {field.value && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                  <label
                    className="text-sm font-medium leading-none cursor-pointer"
                    onClick={() => field.onChange(!field.value)}
                  >
                    Horas Extras
                  </label>
                </div>
              )}
            />
            
            <FormField
              control={form.control}
              name="verbas.danoMoral"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <div 
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border ${field.value ? 'bg-primary border-primary' : 'border-primary'} cursor-pointer`}
                    onClick={() => field.onChange(!field.value)}
                  >
                    {field.value && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                  <label
                    className="text-sm font-medium leading-none cursor-pointer"
                    onClick={() => field.onChange(!field.value)}
                  >
                    Dano Moral
                  </label>
                </div>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TipoPeticaoStep;
