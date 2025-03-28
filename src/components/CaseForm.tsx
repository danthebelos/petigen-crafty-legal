
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CaseFormValues } from "@/types/case";

const formSchema = z.object({
  numero: z.string().min(1, "Número do processo é obrigatório"),
  tipo: z.string().min(1, "Tipo do processo é obrigatório"),
  cliente: z.string().min(1, "Nome do cliente é obrigatório"),
  status: z.enum(["ativo", "arquivado", "concluido", "pendente"]),
  dataEntrada: z.string().min(1, "Data de entrada é obrigatória"),
  dataAudiencia: z.string().optional(),
  vara: z.string().optional(),
  tribunal: z.string().optional(),
  observacoes: z.string().optional(),
});

interface CaseFormProps {
  onSubmit: (data: CaseFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<CaseFormValues>;
}

export const CaseForm: React.FC<CaseFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {
    numero: "",
    tipo: "trabalhista",
    cliente: "",
    status: "ativo",
    dataEntrada: new Date().toISOString().split("T")[0],
    dataAudiencia: "",
    vara: "",
    tribunal: "",
    observacoes: "",
  },
}) => {
  const form = useForm<CaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Processo*</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 0001234-55.2023.8.26.0100" {...field} />
                </FormControl>
                <FormDescription>
                  Informe o número completo do processo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do Processo*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="civel">Cível</SelectItem>
                    <SelectItem value="consumidor">Consumidor</SelectItem>
                    <SelectItem value="familia">Família</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente*</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status do Processo*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataEntrada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Entrada*</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataAudiencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da Audiência</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vara"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vara</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 2ª Vara do Trabalho" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tribunal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tribunal</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: TRT-2, TJSP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações adicionais sobre o processo"
                  className="resize-y"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Processo
          </Button>
        </div>
      </form>
    </Form>
  );
};
