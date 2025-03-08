
import { z } from "zod";

export const steps = [
  { id: "tipo", label: "Tipo" },
  { id: "parte", label: "Parte Reclamante" },
  { id: "parte-reclamada", label: "Parte Reclamada" },
  { id: "fatos", label: "Fatos e Argumentos" },
  { id: "verbas", label: "Verbas Trabalhistas" },
  { id: "questoes", label: "Revisão" },
];

export const formSchema = z.object({
  tipo: z.string().min(1, "Selecione o tipo de petição"),
  
  // Dados pessoais do reclamante
  nomeReclamante: z.string().min(1, "Nome do reclamante é obrigatório"),
  cpfReclamante: z.string().min(11, "CPF inválido"),
  rgReclamante: z.string().optional(),
  enderecoReclamante: z.string().optional(),
  cep: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  emailReclamante: z.string().email("Email inválido").optional().or(z.literal("")),
  telefoneReclamante: z.string().optional(),
  
  // Dados da empresa reclamada
  nomeReclamada: z.string().min(1, "Nome da reclamada é obrigatório"),
  cnpjReclamada: z.string().optional(),
  razaoSocialReclamada: z.string().optional(),
  enderecoReclamada: z.string().optional(),
  emailReclamado: z.string().email("Email inválido").optional().or(z.literal("")),
  telefoneReclamado: z.string().optional(),
  
  // Opções
  juizoDigital: z.boolean().default(true),
  solicitaJusticaGratuita: z.boolean().default(true),
  
  // Fatos e argumentos
  descricaoFatos: z.string().min(1, "Descrição dos fatos é obrigatória"),
  argumentos: z.string().optional(),
  pedidos: z.string().optional(),
  
  // Verbas trabalhistas
  verbasTrabalhistas: z.array(z.string()).default([]),
  
  // Advogado selecionado
  advogadoId: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
