
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/types/contract";
import CEPInput from "@/components/CEPInput";

interface DadosPartesStepProps {
  form: UseFormReturn<FormValues>;
}

const DadosPartesStep = ({ form }: DadosPartesStepProps) => {
  const handleAddressDataContratante = (data: any) => {
    form.setValue("enderecoContratante", `${data.logradouro}, ${data.bairro}, ${data.localidade}/${data.uf}`);
  };
  
  const handleAddressDataContratado = (data: any) => {
    form.setValue("enderecoContratado", `${data.logradouro}, ${data.bairro}, ${data.localidade}/${data.uf}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Dados do Contratante</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nomeContratante"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome completo do contratante" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cpfContratante"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="CPF ou CNPJ do contratante" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cepContratante"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <CEPInput 
                    value={field.value || ''} 
                    onChange={field.onChange}
                    onAddressData={handleAddressDataContratante} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="enderecoContratante"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço Completo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Endereço completo do contratante" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Dados do Contratado</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="nomeContratado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome completo do contratado" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cpfContratado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="CPF ou CNPJ do contratado" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cepContratado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <CEPInput 
                    value={field.value || ''} 
                    onChange={field.onChange}
                    onAddressData={handleAddressDataContratado} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="enderecoContratado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço Completo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Endereço completo do contratado" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default DadosPartesStep;
