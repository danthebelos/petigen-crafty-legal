
import { z } from "zod";

// Define os passos do formulário
export interface Step {
  id: string;
  label: string;
}

export const formSchema = z.object({
  inputMethod: z.enum(["questionario", "documento"]),
  tipo: z.string().min(1, { message: "Selecione um tipo de petição" }),
  
  // Dados do reclamante
  nomeReclamante: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }).optional(),
  cpfReclamante: z.string().min(11, { message: "CPF inválido" }).optional(),
  rgReclamante: z.string().min(5, { message: "RG inválido" }).optional(),
  
  // Dados de endereço
  cep: z.string().optional(),
  enderecoReclamante: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  
  // Contato do reclamante
  emailReclamante: z.string().email({ message: "Email inválido" }).optional(),
  telefoneReclamante: z.string().optional(),
  
  // Dados da empresa reclamada
  nomeReclamada: z.string().optional(),
  cnpjReclamada: z.string().optional(),
  razaoSocialReclamada: z.string().optional(),
  enderecoReclamada: z.string().optional(),
  
  // Contato da parte reclamada
  emailReclamado: z.string().email({ message: "Email inválido" }).optional(),
  telefoneReclamado: z.string().optional(),
  
  // Fatos e argumentos
  descricaoFatos: z.string().min(10, { message: "Descreva os fatos com pelo menos 10 caracteres" }).optional(),
  argumentos: z.string().optional(),
  pedidos: z.string().optional(),
  
  // Opções de justiça gratuita
  solicitaJusticaGratuita: z.boolean().default(true),
  
  // Opção para juízo 100% digital
  juizoDigital: z.boolean().default(true),
});

export type FormValues = z.infer<typeof formSchema>;

export const steps: Step[] = [
  { id: "metodo", label: "Método de Entrada" },
  { id: "tipo", label: "Tipo de Petição" },
  { id: "parte", label: "Dados da Parte" },
  { id: "parte-reclamada", label: "Dados da Empresa" },
  { id: "fatos", label: "Fatos e Argumentos" },
  { id: "questoes", label: "Questões Prévias" },
];
