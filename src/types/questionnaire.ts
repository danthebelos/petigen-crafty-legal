
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
  enderecoReclamante: z.string().optional(),
  cep: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  
  // Opções específicas para petição trabalhista
  verbas: z.object({
    ferias: z.boolean().default(false),
    decimoTerceiro: z.boolean().default(false),
    fgts: z.boolean().default(false),
    multaRescisoria: z.boolean().default(false),
    avisoPrevio: z.boolean().default(false),
    horasExtras: z.boolean().default(false),
    danoMoral: z.boolean().default(false),
  }).optional(),
  
  // Fatos e argumentos
  descricaoFatos: z.string().min(10, { message: "Descreva os fatos com pelo menos 10 caracteres" }).optional(),
  argumentos: z.string().optional(),
  pedidos: z.string().optional(),
  
  // Para método de documento
  descricaoBreve: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const steps: Step[] = [
  { id: "metodo", label: "Método de Entrada" },
  { id: "tipo", label: "Tipo de Petição" },
  { id: "parte", label: "Dados da Parte" },
  { id: "fatos", label: "Fatos e Argumentos" },
  { id: "documento", label: "Anexar Documento" },
];
