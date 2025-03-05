
import { z } from "zod";

// Define os passos do formulário
export interface Step {
  id: string;
  label: string;
}

export const contractFormSchema = z.object({
  tipo: z.string().min(1, { message: "Selecione um tipo de contrato" }),
  
  // Dados do contratante
  nomeContratante: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cpfContratante: z.string().min(11, { message: "CPF/CNPJ inválido" }),
  enderecoContratante: z.string().min(3, { message: "Endereço inválido" }),
  cepContratante: z.string().optional(),
  
  // Dados do contratado
  nomeContratado: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cpfContratado: z.string().min(11, { message: "CPF/CNPJ inválido" }),
  enderecoContratado: z.string().min(3, { message: "Endereço inválido" }),
  cepContratado: z.string().optional(),
  
  // Cláusulas do contrato
  objeto: z.string().min(10, { message: "Descreva o objeto com pelo menos 10 caracteres" }),
  prazo: z.string().min(1, { message: "Informe o prazo do contrato" }),
  valor: z.string().min(1, { message: "Informe o valor do contrato" }),
  formaPagamento: z.string().min(1, { message: "Informe a forma de pagamento" }),
  clausulasAdicionais: z.string().optional(),
});

export type FormValues = z.infer<typeof contractFormSchema>;

export const contractSteps: Step[] = [
  { id: "tipo", label: "Tipo de Contrato" },
  { id: "partes", label: "Dados das Partes" },
  { id: "clausulas", label: "Cláusulas do Contrato" },
];
