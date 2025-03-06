
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
  emailReclamante: z.string().email({ message: "Email inválido" }).optional(),
  telefoneReclamante: z.string().optional(),
  
  // Contato da parte reclamada
  emailReclamado: z.string().email({ message: "Email inválido" }).optional(),
  telefoneReclamado: z.string().optional(),
  
  // Opções específicas para petição trabalhista
  verbas: z.object({
    // 1. Verbas Rescisórias
    avisoPrevioTrabalhado: z.boolean().default(false),
    avisoPrevioIndenizado: z.boolean().default(false),
    saldoSalario: z.boolean().default(false),
    feriasVencidas: z.boolean().default(false),
    feriasProporcionais: z.boolean().default(false),
    decimoTerceiro: z.boolean().default(false),
    multaFgts: z.boolean().default(false),
    seguroDesemprego: z.boolean().default(false),
    fgtsNaoDepositado: z.boolean().default(false),
    
    // 2. Adicionais e Benefícios
    adicionalNoturno: z.boolean().default(false),
    adicionalInsalubridade: z.boolean().default(false),
    adicionalPericulosidade: z.boolean().default(false),
    
    // 3. Jornadas e Horas Extras
    horaExtra: z.boolean().default(false),
    intervaloInterjornada: z.boolean().default(false),
    intervaloIntrajornada: z.boolean().default(false),
    
    // 4. Direitos Relacionados à Função
    acumuloFuncao: z.boolean().default(false),
    desvioFuncao: z.boolean().default(false),
    
    // 5. Direitos Relacionados ao Pagamento
    salarioAtrasado: z.boolean().default(false),
    salarioPorFora: z.boolean().default(false),
    inssNaoRecolhido: z.boolean().default(false),
    
    // 6. Direitos Relacionados ao Contrato de Trabalho
    reconhecimentoVinculo: z.boolean().default(false),
    registroCarteiraInexistente: z.boolean().default(false),
    rescisaoIndireta: z.boolean().default(false),
    reversaoPedidoDemissao: z.boolean().default(false),
    
    // 7. Indenizações e Danos
    danosMorais: z.boolean().default(false),
    indenizacaoEstabilidade: z.boolean().default(false),
    indenizacaoDispensaDiscriminatoria: z.boolean().default(false),
    
    // 8. Multas Aplicáveis ao Empregador
    multaArt477: z.boolean().default(false),
    multaArt467: z.boolean().default(false),
    
    // Antigas opções (mantidas para compatibilidade)
    ferias: z.boolean().default(false),
    multaRescisoria: z.boolean().default(false),
    avisoPrevio: z.boolean().default(false),
    horasExtras: z.boolean().default(false),
    danoMoral: z.boolean().default(false),
  }).optional(),
  
  // Opções de justiça gratuita
  solicitaJusticaGratuita: z.boolean().default(true),
  
  // Fatos e argumentos
  descricaoFatos: z.string().min(10, { message: "Descreva os fatos com pelo menos 10 caracteres" }).optional(),
  argumentos: z.string().optional(),
  pedidos: z.string().optional(),
  
  // Para método de documento
  descricaoBreve: z.string().optional(),
  
  // Opção para juízo 100% digital
  juizoDigital: z.boolean().default(true),
});

export type FormValues = z.infer<typeof formSchema>;

export const steps: Step[] = [
  { id: "metodo", label: "Método de Entrada" },
  { id: "tipo", label: "Tipo de Petição" },
  { id: "parte", label: "Dados da Parte" },
  { id: "verbas", label: "Verbas e Pedidos" },
  { id: "fatos", label: "Fatos e Argumentos" },
  { id: "questoes", label: "Questões Prévias" },
  { id: "documento", label: "Anexar Documento" },
];
