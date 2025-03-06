
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/questionnaire";

interface DadosReclamadaStepProps {
  form: UseFormReturn<FormValues>;
}

const DadosReclamadaStep = ({ form }: DadosReclamadaStepProps) => {
  // Função para formatar CNPJ
  const formatarCNPJ = (value: string) => {
    // Remove caracteres não numéricos
    const cnpjLimpo = value.replace(/\D/g, '');
    
    // Aplica formatação: 00.000.000/0000-00
    if (cnpjLimpo.length <= 2) {
      return cnpjLimpo;
    } else if (cnpjLimpo.length <= 5) {
      return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2)}`;
    } else if (cnpjLimpo.length <= 8) {
      return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5)}`;
    } else if (cnpjLimpo.length <= 12) {
      return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5, 8)}/${cnpjLimpo.slice(8)}`;
    } else {
      return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5, 8)}/${cnpjLimpo.slice(8, 12)}-${cnpjLimpo.slice(12, 14)}`;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-zinc-900">Dados da Empresa Reclamada</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="nomeReclamada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Fantasia</FormLabel>
              <FormControl>
                <Input placeholder="Nome da empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="razaoSocialReclamada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão Social</FormLabel>
              <FormControl>
                <Input placeholder="Razão social completa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cnpjReclamada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input 
                  placeholder="00.000.000/0000-00" 
                  value={field.value || ""}
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const formattedValue = formatarCNPJ(rawValue);
                    field.onChange(formattedValue);
                  }}
                  maxLength={18}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="enderecoReclamada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço Completo</FormLabel>
              <FormControl>
                <Input placeholder="Endereço da empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="emailReclamado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="empresa@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="telefoneReclamado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DadosReclamadaStep;
