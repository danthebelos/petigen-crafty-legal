
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

// Categorias de verbas trabalhistas
export const verbasTrabalhistas = [
  {
    id: "remuneracao",
    label: "Remuneração",
    items: [
      { id: "salarios_atrasados", label: "Salários Atrasados" },
      { id: "decimo_terceiro", label: "Décimo Terceiro Salário" },
      { id: "ferias_proporcionais", label: "Férias Proporcionais" },
      { id: "ferias_vencidas", label: "Férias Vencidas" },
      { id: "adicional_um_terco_ferias", label: "Adicional de 1/3 de Férias" },
      { id: "comissoes", label: "Comissões" },
      { id: "horas_extras", label: "Horas Extras" },
    ]
  },
  {
    id: "fgts",
    label: "FGTS e Indenizações",
    items: [
      { id: "fgts_nao_depositado", label: "FGTS Não Depositado" },
      { id: "multa_40_fgts", label: "Multa de 40% do FGTS" },
      { id: "indenizacao_compensatoria", label: "Indenização Compensatória" },
      { id: "aviso_previo", label: "Aviso Prévio" },
      { id: "seguro_desemprego", label: "Seguro-Desemprego" },
    ]
  },
  {
    id: "adicionais",
    label: "Adicionais",
    items: [
      { id: "adicional_noturno", label: "Adicional Noturno" },
      { id: "adicional_insalubridade", label: "Adicional de Insalubridade" },
      { id: "adicional_periculosidade", label: "Adicional de Periculosidade" },
      { id: "adicional_transferencia", label: "Adicional de Transferência" },
    ]
  },
  {
    id: "extras",
    label: "Outros Pedidos",
    items: [
      { id: "danos_morais", label: "Danos Morais" },
      { id: "danos_materiais", label: "Danos Materiais" },
      { id: "equiparacao_salarial", label: "Equiparação Salarial" },
      { id: "horas_in_itinere", label: "Horas In Itinere" },
      { id: "reconhecimento_vinculo", label: "Reconhecimento de Vínculo Empregatício" },
    ]
  }
];
