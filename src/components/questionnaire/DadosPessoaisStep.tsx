
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";
import { Check } from "lucide-react";
import CEPInput from "@/components/CEPInput";

interface DadosPessoaisStepProps {
  form: UseFormReturn<FormValues>;
}

const DadosPessoaisStep = ({ form }: DadosPessoaisStepProps) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nomeReclamante"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cpfReclamante"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="000.000.000-00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="rgReclamante"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RG</FormLabel>
              <FormControl>
                <Input placeholder="Digite o RG" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="enderecoReclamante"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="complemento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input placeholder="Apto, Bloco, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bairro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input placeholder="Digite o bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <CEPInput
                  value={field.value || ""}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  onAddressData={(data) => {
                    if (data.logradouro) form.setValue("enderecoReclamante", data.logradouro);
                    if (data.bairro) form.setValue("bairro", data.bairro);
                    if (data.localidade) form.setValue("cidade", data.localidade);
                    if (data.uf) form.setValue("estado", data.uf);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Digite a cidade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input placeholder="UF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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

export default DadosPessoaisStep;
