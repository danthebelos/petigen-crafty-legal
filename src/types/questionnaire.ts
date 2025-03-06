
import { z } from "zod";

// Define os passos do formulário
export interface Step {
  id: string;
  label: string;
}

export const formSchema = z.object({
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
  
  // Verbas e pedidos trabalhistas
  verbasTrabalhistas: z.array(z.string()).default([]),
});

export type FormValues = z.infer<typeof formSchema>;

export const steps: Step[] = [
  { id: "tipo", label: "Tipo de Petição" },
  { id: "parte", label: "Dados da Parte" },
  { id: "parte-reclamada", label: "Dados da Empresa" },
  { id: "fatos", label: "Fatos e Argumentos" },
  { id: "verbas", label: "Verbas e Pedidos" },
  { id: "questoes", label: "Questões Prévias" },
];

// Categorias de verbas trabalhistas
export const verbasTrabalhistas = [
  {
    id: "verbas-rescisorias",
    label: "1. Verbas Rescisórias",
    items: [
      { id: "aviso-previo-trabalhado", label: "Aviso Prévio Trabalhado" },
      { id: "aviso-previo-indenizado", label: "Aviso Prévio Indenizado" },
      { id: "saldo-salario", label: "Saldo de Salário" },
      { id: "ferias-vencidas", label: "Férias Vencidas + 1/3" },
      { id: "ferias-proporcionais", label: "Férias Proporcionais + 1/3" },
      { id: "13-salario-proporcional", label: "13º Salário Proporcional" },
      { id: "multa-fgts", label: "Multa de 40% do FGTS (dispensa sem justa causa)" },
      { id: "seguro-desemprego", label: "Seguro-Desemprego" },
      { id: "fgts-nao-depositado", label: "FGTS não depositado" },
    ]
  },
  {
    id: "adicionais-beneficios",
    label: "2. Adicionais e Benefícios",
    items: [
      { id: "adicional-noturno", label: "Adicional Noturno" },
      { id: "adicional-insalubridade", label: "Adicional de Insalubridade" },
      { id: "adicional-periculosidade", label: "Adicional de Periculosidade" },
    ]
  },
  {
    id: "jornadas-horas-extras",
    label: "3. Jornadas e Horas Extras",
    items: [
      { id: "hora-extra", label: "Hora Extra" },
      { id: "intervalo-interjornada", label: "Intervalo Interjornada" },
      { id: "intervalo-intrajornada", label: "Intervalo Intrajornada" },
    ]
  },
  {
    id: "direitos-funcao",
    label: "4. Direitos Relacionados à Função",
    items: [
      { id: "acumulo-funcao", label: "Acúmulo de Função" },
      { id: "desvio-funcao", label: "Desvio de Função" },
    ]
  },
  {
    id: "direitos-pagamento",
    label: "5. Direitos Relacionados ao Pagamento",
    items: [
      { id: "salario-atrasado", label: "Salário Atrasado" },
      { id: "salario-por-fora", label: "Salário \"por fora\" (valores não registrados)" },
      { id: "recolhimento-inss", label: "Recolhimento do INSS não realizado corretamente" },
    ]
  },
  {
    id: "direitos-contrato",
    label: "6. Direitos Relacionados ao Contrato de Trabalho",
    items: [
      { id: "reconhecimento-vinculo", label: "Reconhecimento de Vínculo Empregatício" },
      { id: "registro-carteira", label: "Registro de Carteira Não Efetuado" },
      { id: "rescisao-indireta", label: "Rescisão Indireta" },
      { id: "reversao-pedido", label: "Reversão do Pedido de Demissão em Rescisão Indireta" },
    ]
  },
  {
    id: "indenizacoes-danos",
    label: "7. Indenizações e Danos",
    items: [
      { id: "danos-morais-materiais", label: "Indenização por Danos Morais e Materiais" },
      { id: "estabilidade-violada", label: "Indenização por Estabilidade Violada" },
      { id: "dispensa-discriminatoria", label: "Indenização por Dispensa Discriminatória" },
    ]
  },
  {
    id: "multas-aplicaveis",
    label: "8. Multas Aplicáveis",
    items: [
      { id: "multa-art-477", label: "Multa do Art. 477 da CLT" },
      { id: "multa-art-467", label: "Multa do Art. 467 da CLT" },
    ]
  },
];
