
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import StepIndicator from "@/components/StepIndicator";
import QuestionTooltip from "@/components/QuestionTooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type TipoPeticao = 
  | "trabalhista" 
  | "indenizatoria" 
  | "divorcio" 
  | "habeas_corpus" 
  | "execucao"
  | "outro";

// Interface para dados comuns a todos os tipos de petição
interface DadosBase {
  tipoPeticao: TipoPeticao;
  urgencia: "baixa" | "media" | "alta";
  casoPrazo?: string;
  detalhesAdicionais?: string;
}

// Interface para petição trabalhista
interface DadosTrabalhista extends DadosBase {
  reclamante: {
    nome: string;
    cpf: string;
    rg: string;
    endereco: string;
    telefone: string;
    email: string;
    estadoCivil: string;
    dataNascimento: string;
    pis: string;
    ctps: string;
  };
  reclamada: {
    razaoSocial: string;
    cnpj: string;
    endereco: string;
    representanteLegal: string;
  };
  contratoTrabalho: {
    dataAdmissao: string;
    dataDemissao: string;
    funcao: string;
    ultimoSalario: string;
    jornadaContratual: string;
    jornadaEfetiva: string;
    tipoDemissao: "sem_justa_causa" | "com_justa_causa" | "pedido_demissao" | "";
  };
  pedidos: {
    verbasRescisorias: boolean;
    verbasRescisoriasDetalhes: string;
    horasExtras: boolean;
    horasExtrasDetalhes: string;
    adicionalNoturno: boolean;
    adicionalNoturnoDetalhes: string;
    adicionalInsalubridade: boolean;
    adicionalInsalubridadeDetalhes: string;
    equiparacaoSalarial: boolean;
    equiparacaoSalarialDetalhes: string;
    danosMorais: boolean;
    danosMoraisDetalhes: string;
    outrosPedidos: boolean;
    outrosPedidosDetalhes: string;
  };
  informacoesComplementares: {
    testemunhas: boolean;
    documentos: boolean;
    documentosDetalhes: string;
    tentativaExtrajudicial: boolean;
    propostaAcordo: boolean;
    valorAcordo: string;
  };
}

// Interface para petição indenizatória (cível)
interface DadosIndenizatoria extends DadosBase {
  autor: {
    nome: string;
    cpf: string;
    rg: string;
    endereco: string;
    telefone: string;
    email: string;
    estadoCivil: string;
    profissao: string;
  };
  reu: {
    nome: string;
    cpfCnpj: string;
    endereco: string;
  };
  causa: {
    tipoDano: "material" | "moral" | "estetico" | "outro" | "";
    dataEvento: string;
    localEvento: string;
    descricao: string;
    valorPrejuizo: string;
    lesaoFisica: boolean;
    tratamentoMedico: boolean;
    periodoTratamento: string;
    sequelasPermanentes: boolean;
  };
  provas: {
    documentos: boolean;
    documentosDetalhes: string;
    testemunhas: boolean;
    pericia: boolean;
  };
  pedidos: {
    valorDanosMorais: string;
    valorDanosMateriais: string;
    outrosPedidos: string;
    interesseConciliacao: boolean;
  };
}

// Interface para petição de divórcio
interface DadosDivorcio extends DadosBase {
  requerente: {
    nome: string;
    cpf: string;
    rg: string;
    endereco: string;
    telefone: string;
    email: string;
    profissao: string;
    rendaMensal: string;
  };
  conjuge: {
    nome: string;
    cpf: string;
    endereco: string;
  };
  casamento: {
    dataCasamento: string;
    regimeBens: string;
    dataSeparacaoFato: string;
    filhos: boolean;
  };
  filhos: {
    nomesIdades: string;
    guardaProposta: "compartilhada" | "unilateral" | "";
    visitacao: string;
    pensaoAlimenticia: string;
  };
  bens: {
    existemBens: boolean;
    descricaoBens: string;
    propostaPartilha: string;
  };
  dividas: {
    existemDividas: boolean;
    descricaoDividas: string;
    propostaDivisao: string;
  };
  outrosPedidos: {
    retomadaNome: boolean;
    alimentosConjuge: boolean;
    interesseConciliacao: boolean;
  };
}

// Interface para habeas corpus
interface DadosHabeasCorpus extends DadosBase {
  paciente: {
    nome: string;
    cpf: string;
    rg: string;
    dataNascimento: string;
    filiacao: string;
    endereco: string;
    localRecolhimento: string;
  };
  coator: {
    autoridade: string;
    cargo: string;
    localExercicio: string;
  };
  coacao: {
    dataPrisao: string;
    localPrisao: string;
    numeroProcesso: string;
    varaProcesso: string;
    descricaoConstrangimento: string;
    fundamentoJuridico: string;
    riscoIminente: boolean;
  };
  provas: {
    documentos: string;
    tentativaPrevia: boolean;
  };
  pedido: {
    tipoHabeasCorpus: "preventivo" | "liberatorio" | "";
    liminar: boolean;
    justificativaUrgencia: string;
  };
}

// Interface para execução de título extrajudicial
interface DadosExecucao extends DadosBase {
  exequente: {
    nome: string;
    cpfCnpj: string;
    rg: string;
    endereco: string;
    telefone: string;
    email: string;
    estadoCivil: string;
    profissao: string;
  };
  executado: {
    nome: string;
    cpfCnpj: string;
    endereco: string;
    telefone: string;
    email: string;
  };
  titulo: {
    tipoTitulo: string;
    dataEmissao: string;
    dataVencimento: string;
    valorOriginal: string;
    valorAtualizado: string;
    protesto: boolean;
    tentativaNegociacao: boolean;
  };
  garantias: {
    existeGarantia: boolean;
    tipoGarantia: string;
    descricaoBens: string;
    conheceOutrosBens: boolean;
    descricaoOutrosBens: string;
  };
  complementares: {
    interesseConciliacao: boolean;
    pedidoCitacao: string;
    penhora: boolean;
    restricaoVeiculos: boolean;
    outrosPedidos: string;
  };
}

// União de todos os tipos de petição
type DadosQuestionario = 
  | (DadosTrabalhista & { tipoPeticao: "trabalhista" })
  | (DadosIndenizatoria & { tipoPeticao: "indenizatoria" })
  | (DadosDivorcio & { tipoPeticao: "divorcio" })
  | (DadosHabeasCorpus & { tipoPeticao: "habeas_corpus" })
  | (DadosExecucao & { tipoPeticao: "execucao" })
  | (DadosBase & { tipoPeticao: "outro", camposAdicionais?: Record<string, any> });

declare global {
  interface Window {
    enviarMensagemParaChat: (mensagem: string) => void;
  }
}

const QuestionnaireForm = () => {
  const [tipoPeticaoSelecionada, setTipoPeticaoSelecionada] = useState<TipoPeticao>("trabalhista");
  const [passo, setPasso] = useState(1);
  const [maxPassos, setMaxPassos] = useState(5);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [enviandoParaIA, setEnviandoParaIA] = useState(false);
  const { toast } = useToast();
  
  // Dados da petição trabalhista
  const [dadosTrabalhista, setDadosTrabalhista] = useState<DadosTrabalhista>({
    tipoPeticao: "trabalhista",
    urgencia: "media",
    reclamante: {
      nome: "",
      cpf: "",
      rg: "",
      endereco: "",
      telefone: "",
      email: "",
      estadoCivil: "",
      dataNascimento: "",
      pis: "",
      ctps: "",
    },
    reclamada: {
      razaoSocial: "",
      cnpj: "",
      endereco: "",
      representanteLegal: "",
    },
    contratoTrabalho: {
      dataAdmissao: "",
      dataDemissao: "",
      funcao: "",
      ultimoSalario: "",
      jornadaContratual: "",
      jornadaEfetiva: "",
      tipoDemissao: "",
    },
    pedidos: {
      verbasRescisorias: false,
      verbasRescisoriasDetalhes: "",
      horasExtras: false,
      horasExtrasDetalhes: "",
      adicionalNoturno: false,
      adicionalNoturnoDetalhes: "",
      adicionalInsalubridade: false,
      adicionalInsalubridadeDetalhes: "",
      equiparacaoSalarial: false,
      equiparacaoSalarialDetalhes: "",
      danosMorais: false,
      danosMoraisDetalhes: "",
      outrosPedidos: false,
      outrosPedidosDetalhes: "",
    },
    informacoesComplementares: {
      testemunhas: false,
      documentos: false,
      documentosDetalhes: "",
      tentativaExtrajudicial: false,
      propostaAcordo: false,
      valorAcordo: "",
    },
    casoPrazo: "",
    detalhesAdicionais: "",
  });
  
  // Dados da petição indenizatória
  const [dadosIndenizatoria, setDadosIndenizatoria] = useState<DadosIndenizatoria>({
    tipoPeticao: "indenizatoria",
    urgencia: "media",
    autor: {
      nome: "",
      cpf: "",
      rg: "",
      endereco: "",
      telefone: "",
      email: "",
      estadoCivil: "",
      profissao: "",
    },
    reu: {
      nome: "",
      cpfCnpj: "",
      endereco: "",
    },
    causa: {
      tipoDano: "",
      dataEvento: "",
      localEvento: "",
      descricao: "",
      valorPrejuizo: "",
      lesaoFisica: false,
      tratamentoMedico: false,
      periodoTratamento: "",
      sequelasPermanentes: false,
    },
    provas: {
      documentos: false,
      documentosDetalhes: "",
      testemunhas: false,
      pericia: false,
    },
    pedidos: {
      valorDanosMorais: "",
      valorDanosMateriais: "",
      outrosPedidos: "",
      interesseConciliacao: false,
    },
    casoPrazo: "",
    detalhesAdicionais: "",
  });
  
  // Dados da petição de divórcio
  const [dadosDivorcio, setDadosDivorcio] = useState<DadosDivorcio>({
    tipoPeticao: "divorcio",
    urgencia: "media",
    requerente: {
      nome: "",
      cpf: "",
      rg: "",
      endereco: "",
      telefone: "",
      email: "",
      profissao: "",
      rendaMensal: "",
    },
    conjuge: {
      nome: "",
      cpf: "",
      endereco: "",
    },
    casamento: {
      dataCasamento: "",
      regimeBens: "",
      dataSeparacaoFato: "",
      filhos: false,
    },
    filhos: {
      nomesIdades: "",
      guardaProposta: "",
      visitacao: "",
      pensaoAlimenticia: "",
    },
    bens: {
      existemBens: false,
      descricaoBens: "",
      propostaPartilha: "",
    },
    dividas: {
      existemDividas: false,
      descricaoDividas: "",
      propostaDivisao: "",
    },
    outrosPedidos: {
      retomadaNome: false,
      alimentosConjuge: false,
      interesseConciliacao: false,
    },
    casoPrazo: "",
    detalhesAdicionais: "",
  });
  
  // Dados da petição de habeas corpus
  const [dadosHabeasCorpus, setDadosHabeasCorpus] = useState<DadosHabeasCorpus>({
    tipoPeticao: "habeas_corpus",
    urgencia: "alta",
    paciente: {
      nome: "",
      cpf: "",
      rg: "",
      dataNascimento: "",
      filiacao: "",
      endereco: "",
      localRecolhimento: "",
    },
    coator: {
      autoridade: "",
      cargo: "",
      localExercicio: "",
    },
    coacao: {
      dataPrisao: "",
      localPrisao: "",
      numeroProcesso: "",
      varaProcesso: "",
      descricaoConstrangimento: "",
      fundamentoJuridico: "",
      riscoIminente: false,
    },
    provas: {
      documentos: "",
      tentativaPrevia: false,
    },
    pedido: {
      tipoHabeasCorpus: "",
      liminar: false,
      justificativaUrgencia: "",
    },
    casoPrazo: "",
    detalhesAdicionais: "",
  });
  
  // Dados da petição de execução
  const [dadosExecucao, setDadosExecucao] = useState<DadosExecucao>({
    tipoPeticao: "execucao",
    urgencia: "media",
    exequente: {
      nome: "",
      cpfCnpj: "",
      rg: "",
      endereco: "",
      telefone: "",
      email: "",
      estadoCivil: "",
      profissao: "",
    },
    executado: {
      nome: "",
      cpfCnpj: "",
      endereco: "",
      telefone: "",
      email: "",
    },
    titulo: {
      tipoTitulo: "",
      dataEmissao: "",
      dataVencimento: "",
      valorOriginal: "",
      valorAtualizado: "",
      protesto: false,
      tentativaNegociacao: false,
    },
    garantias: {
      existeGarantia: false,
      tipoGarantia: "",
      descricaoBens: "",
      conheceOutrosBens: false,
      descricaoOutrosBens: "",
    },
    complementares: {
      interesseConciliacao: false,
      pedidoCitacao: "",
      penhora: false,
      restricaoVeiculos: false,
      outrosPedidos: "",
    },
    casoPrazo: "",
    detalhesAdicionais: "",
  });
  
  // Dados para outros tipos de petição
  const [dadosOutro, setDadosOutro] = useState<DadosBase & { tipoPeticao: "outro" }>({
    tipoPeticao: "outro",
    urgencia: "media",
    casoPrazo: "",
    detalhesAdicionais: "",
  });
  
  // Definir o array de passos com base no tipo de petição selecionado
  useEffect(() => {
    switch (tipoPeticaoSelecionada) {
      case "trabalhista":
        setMaxPassos(5);
        setPasso(1);
        break;
      case "indenizatoria":
        setMaxPassos(5);
        setPasso(1);
        break;
      case "divorcio":
        setMaxPassos(6);
        setPasso(1);
        break;
      case "habeas_corpus":
        setMaxPassos(4);
        setPasso(1);
        break;
      case "execucao":
        setMaxPassos(5);
        setPasso(1);
        break;
      case "outro":
        setMaxPassos(2);
        setPasso(1);
        break;
    }
  }, [tipoPeticaoSelecionada]);
  
  const getNomePassos = () => {
    switch (tipoPeticaoSelecionada) {
      case "trabalhista":
        return ["Tipo de Petição", "Dados do Reclamante", "Dados da Reclamada", "Contrato de Trabalho", "Pedidos"];
      case "indenizatoria":
        return ["Tipo de Petição", "Dados do Autor", "Dados do Réu", "Informações da Causa", "Provas e Pedidos"];
      case "divorcio":
        return ["Tipo de Petição", "Dados do Requerente", "Dados do Cônjuge", "Informações do Casamento", "Filhos", "Bens e Dívidas"];
      case "habeas_corpus":
        return ["Tipo de Petição", "Dados do Paciente", "Dados do Coator", "Informações da Coação"];
      case "execucao":
        return ["Tipo de Petição", "Dados do Exequente", "Dados do Executado", "Informações do Título", "Garantias"];
      case "outro":
        return ["Tipo de Petição", "Detalhes"];
      default:
        return ["Passo 1", "Passo 2", "Passo 3", "Passo 4", "Passo 5"];
    }
  };
  
  const passoAnterior = () => {
    if (passo > 1) setPasso(passo - 1);
  };

  const proximoPasso = () => {
    if (passo < maxPassos) setPasso(passo + 1);
    else revisarDados();
  };
  
  const revisarDados = () => {
    setConfirmacaoAberta(true);
  };
  
  const confirmarEnvio = async () => {
    setConfirmacaoAberta(false);
    setEnviandoParaIA(true);
    
    try {
      // Obter os dados atuais com base no tipo de petição selecionado
      let dadosAtuais: DadosQuestionario;
      switch (tipoPeticaoSelecionada) {
        case "trabalhista":
          dadosAtuais = dadosTrabalhista;
          break;
        case "indenizatoria":
          dadosAtuais = dadosIndenizatoria;
          break;
        case "divorcio":
          dadosAtuais = dadosDivorcio;
          break;
        case "habeas_corpus":
          dadosAtuais = dadosHabeasCorpus;
          break;
        case "execucao":
          dadosAtuais = dadosExecucao;
          break;
        case "outro":
          dadosAtuais = dadosOutro;
          break;
        default:
          dadosAtuais = dadosTrabalhista;
      }
      
      // Criar ID único para a petição
      const peticaoId = crypto.randomUUID();
      
      // Salvar dados no Supabase
      await supabase
        .from("conversations")
        .insert([
          {
            id: peticaoId,
            title: `Petição ${getTipoPeticaoTexto(tipoPeticaoSelecionada)}`,
            context: JSON.stringify(dadosAtuais),
          },
        ]);
      
      // Formatar dados para enviar para o chat com base no tipo de petição
      const mensagemFormatada = formatarMensagemParaIA(dadosAtuais);
      
      // Enviar para o chat automaticamente
      if (window.enviarMensagemParaChat) {
        window.enviarMensagemParaChat(mensagemFormatada);
        
        toast({
          title: "Petição em elaboração",
          description: "A IA está gerando sua petição com base nos dados informados.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Houve um problema ao comunicar com a IA. Por favor, tente novamente.",
        });
      }
      
      // Limpar formulário e voltar ao primeiro passo
      limparFormulario();
      setPasso(1);
      
    } catch (erro) {
      console.error("Erro ao enviar dados:", erro);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Houve um problema ao processar sua petição. Por favor, tente novamente.",
      });
    } finally {
      setEnviandoParaIA(false);
    }
  };
  
  const limparFormulario = () => {
    // Resetar todos os estados de formulário
    setDadosTrabalhista({
      tipoPeticao: "trabalhista",
      urgencia: "media",
      reclamante: {
        nome: "",
        cpf: "",
        rg: "",
        endereco: "",
        telefone: "",
        email: "",
        estadoCivil: "",
        dataNascimento: "",
        pis: "",
        ctps: "",
      },
      reclamada: {
        razaoSocial: "",
        cnpj: "",
        endereco: "",
        representanteLegal: "",
      },
      contratoTrabalho: {
        dataAdmissao: "",
        dataDemissao: "",
        funcao: "",
        ultimoSalario: "",
        jornadaContratual: "",
        jornadaEfetiva: "",
        tipoDemissao: "",
      },
      pedidos: {
        verbasRescisorias: false,
        verbasRescisoriasDetalhes: "",
        horasExtras: false,
        horasExtrasDetalhes: "",
        adicionalNoturno: false,
        adicionalNoturnoDetalhes: "",
        adicionalInsalubridade: false,
        adicionalInsalubridadeDetalhes: "",
        equiparacaoSalarial: false,
        equiparacaoSalarialDetalhes: "",
        danosMorais: false,
        danosMoraisDetalhes: "",
        outrosPedidos: false,
        outrosPedidosDetalhes: "",
      },
      informacoesComplementares: {
        testemunhas: false,
        documentos: false,
        documentosDetalhes: "",
        tentativaExtrajudicial: false,
        propostaAcordo: false,
        valorAcordo: "",
      },
      casoPrazo: "",
      detalhesAdicionais: "",
    });
    
    setDadosIndenizatoria({
      tipoPeticao: "indenizatoria",
      urgencia: "media",
      autor: {
        nome: "",
        cpf: "",
        rg: "",
        endereco: "",
        telefone: "",
        email: "",
        estadoCivil: "",
        profissao: "",
      },
      reu: {
        nome: "",
        cpfCnpj: "",
        endereco: "",
      },
      causa: {
        tipoDano: "",
        dataEvento: "",
        localEvento: "",
        descricao: "",
        valorPrejuizo: "",
        lesaoFisica: false,
        tratamentoMedico: false,
        periodoTratamento: "",
        sequelasPermanentes: false,
      },
      provas: {
        documentos: false,
        documentosDetalhes: "",
        testemunhas: false,
        pericia: false,
      },
      pedidos: {
        valorDanosMorais: "",
        valorDanosMateriais: "",
        outrosPedidos: "",
        interesseConciliacao: false,
      },
      casoPrazo: "",
      detalhesAdicionais: "",
    });
    
    setDadosDivorcio({
      tipoPeticao: "divorcio",
      urgencia: "media",
      requerente: {
        nome: "",
        cpf: "",
        rg: "",
        endereco: "",
        telefone: "",
        email: "",
        profissao: "",
        rendaMensal: "",
      },
      conjuge: {
        nome: "",
        cpf: "",
        endereco: "",
      },
      casamento: {
        dataCasamento: "",
        regimeBens: "",
        dataSeparacaoFato: "",
        filhos: false,
      },
      filhos: {
        nomesIdades: "",
        guardaProposta: "",
        visitacao: "",
        pensaoAlimenticia: "",
      },
      bens: {
        existemBens: false,
        descricaoBens: "",
        propostaPartilha: "",
      },
      dividas: {
        existemDividas: false,
        descricaoDividas: "",
        propostaDivisao: "",
      },
      outrosPedidos: {
        retomadaNome: false,
        alimentosConjuge: false,
        interesseConciliacao: false,
      },
      casoPrazo: "",
      detalhesAdicionais: "",
    });
    
    setDadosHabeasCorpus({
      tipoPeticao: "habeas_corpus",
      urgencia: "alta",
      paciente: {
        nome: "",
        cpf: "",
        rg: "",
        dataNascimento: "",
        filiacao: "",
        endereco: "",
        localRecolhimento: "",
      },
      coator: {
        autoridade: "",
        cargo: "",
        localExercicio: "",
      },
      coacao: {
        dataPrisao: "",
        localPrisao: "",
        numeroProcesso: "",
        varaProcesso: "",
        descricaoConstrangimento: "",
        fundamentoJuridico: "",
        riscoIminente: false,
      },
      provas: {
        documentos: "",
        tentativaPrevia: false,
      },
      pedido: {
        tipoHabeasCorpus: "",
        liminar: false,
        justificativaUrgencia: "",
      },
      casoPrazo: "",
      detalhesAdicionais: "",
    });
    
    setDadosExecucao({
      tipoPeticao: "execucao",
      urgencia: "media",
      exequente: {
        nome: "",
        cpfCnpj: "",
        rg: "",
        endereco: "",
        telefone: "",
        email: "",
        estadoCivil: "",
        profissao: "",
      },
      executado: {
        nome: "",
        cpfCnpj: "",
        endereco: "",
        telefone: "",
        email: "",
      },
      titulo: {
        tipoTitulo: "",
        dataEmissao: "",
        dataVencimento: "",
        valorOriginal: "",
        valorAtualizado: "",
        protesto: false,
        tentativaNegociacao: false,
      },
      garantias: {
        existeGarantia: false,
        tipoGarantia: "",
        descricaoBens: "",
        conheceOutrosBens: false,
        descricaoOutrosBens: "",
      },
      complementares: {
        interesseConciliacao: false,
        pedidoCitacao: "",
        penhora: false,
        restricaoVeiculos: false,
        outrosPedidos: "",
      },
      casoPrazo: "",
      detalhesAdicionais: "",
    });
    
    setDadosOutro({
      tipoPeticao: "outro",
      urgencia: "media",
      casoPrazo: "",
      detalhesAdicionais: "",
    });
  };
  
  // Função para formatar a mensagem para a IA com base no tipo de petição
  const formatarMensagemParaIA = (dados: DadosQuestionario): string => {
    let mensagem = `Preciso que você elabore uma PETIÇÃO ${getTipoPeticaoTexto(dados.tipoPeticao).toUpperCase()} detalhada, bem fundamentada e com pelo menos 7 páginas, conforme os dados abaixo:\n\n`;
    
    mensagem += `URGÊNCIA: ${getUrgenciaTexto(dados.urgencia)}\n`;
    if (dados.casoPrazo) mensagem += `PRAZO/INFORMAÇÕES ADICIONAIS: ${dados.casoPrazo}\n\n`;
    
    switch (dados.tipoPeticao) {
      case "trabalhista":
        mensagem += formatarDadosTrabalhistas(dados);
        break;
      case "indenizatoria":
        mensagem += formatarDadosIndenizatorios(dados);
        break;
      case "divorcio":
        mensagem += formatarDadosDivorcio(dados);
        break;
      case "habeas_corpus":
        mensagem += formatarDadosHabeasCorpus(dados);
        break;
      case "execucao":
        mensagem += formatarDadosExecucao(dados);
        break;
      case "outro":
        mensagem += `DETALHES ADICIONAIS:\n${dados.detalhesAdicionais}\n\n`;
        break;
    }
    
    mensagem += `Por favor, elabore uma petição detalhada, técnica e extremamente bem fundamentada, com citações de doutrina, jurisprudência e legislação pertinente. Estruture a petição com todas as partes necessárias, incluindo cabeçalho, endereçamento, qualificação das partes, fatos, fundamentos jurídicos, pedidos e fechamento.`;
    
    return mensagem;
  };
  
  // Funções auxiliares para formatar cada tipo de petição
  const formatarDadosTrabalhistas = (dados: DadosTrabalhista): string => {
    let mensagem = "DADOS DO RECLAMANTE:\n";
    mensagem += `Nome: ${dados.reclamante.nome}\n`;
    mensagem += `CPF: ${dados.reclamante.cpf}\n`;
    mensagem += `RG: ${dados.reclamante.rg}\n`;
    mensagem += `Endereço: ${dados.reclamante.endereco}\n`;
    mensagem += `Telefone: ${dados.reclamante.telefone}\n`;
    mensagem += `Email: ${dados.reclamante.email}\n`;
    mensagem += `Estado Civil: ${dados.reclamante.estadoCivil}\n`;
    mensagem += `Data de Nascimento: ${dados.reclamante.dataNascimento}\n`;
    mensagem += `PIS/PASEP: ${dados.reclamante.pis}\n`;
    mensagem += `CTPS: ${dados.reclamante.ctps}\n\n`;
    
    mensagem += "DADOS DA RECLAMADA:\n";
    mensagem += `Razão Social: ${dados.reclamada.razaoSocial}\n`;
    mensagem += `CNPJ: ${dados.reclamada.cnpj}\n`;
    mensagem += `Endereço: ${dados.reclamada.endereco}\n`;
    mensagem += `Representante Legal: ${dados.reclamada.representanteLegal}\n\n`;
    
    mensagem += "INFORMAÇÕES DO CONTRATO DE TRABALHO:\n";
    mensagem += `Data de Admissão: ${dados.contratoTrabalho.dataAdmissao}\n`;
    mensagem += `Data de Demissão: ${dados.contratoTrabalho.dataDemissao}\n`;
    mensagem += `Função Exercida: ${dados.contratoTrabalho.funcao}\n`;
    mensagem += `Último Salário: ${dados.contratoTrabalho.ultimoSalario}\n`;
    mensagem += `Jornada Contratual: ${dados.contratoTrabalho.jornadaContratual}\n`;
    mensagem += `Jornada Efetivamente Cumprida: ${dados.contratoTrabalho.jornadaEfetiva}\n`;
    mensagem += `Tipo de Demissão: ${getTipoDemissaoTexto(dados.contratoTrabalho.tipoDemissao)}\n\n`;
    
    mensagem += "PEDIDOS:\n";
    if (dados.pedidos.verbasRescisorias) {
      mensagem += `- Verbas rescisórias não pagas: ${dados.pedidos.verbasRescisoriasDetalhes}\n`;
    }
    if (dados.pedidos.horasExtras) {
      mensagem += `- Horas extras: ${dados.pedidos.horasExtrasDetalhes}\n`;
    }
    if (dados.pedidos.adicionalNoturno) {
      mensagem += `- Adicional noturno: ${dados.pedidos.adicionalNoturnoDetalhes}\n`;
    }
    if (dados.pedidos.adicionalInsalubridade) {
      mensagem += `- Adicional de insalubridade/periculosidade: ${dados.pedidos.adicionalInsalubridadeDetalhes}\n`;
    }
    if (dados.pedidos.equiparacaoSalarial) {
      mensagem += `- Equiparação salarial: ${dados.pedidos.equiparacaoSalarialDetalhes}\n`;
    }
    if (dados.pedidos.danosMorais) {
      mensagem += `- Danos morais: ${dados.pedidos.danosMoraisDetalhes}\n`;
    }
    if (dados.pedidos.outrosPedidos) {
      mensagem += `- Outros pedidos: ${dados.pedidos.outrosPedidosDetalhes}\n`;
    }
    mensagem += "\n";
    
    mensagem += "INFORMAÇÕES COMPLEMENTARES:\n";
    mensagem += `Existem testemunhas: ${dados.informacoesComplementares.testemunhas ? "Sim" : "Não"}\n`;
    mensagem += `Possui documentos comprobatórios: ${dados.informacoesComplementares.documentos ? "Sim" : "Não"}\n`;
    if (dados.informacoesComplementares.documentos) {
      mensagem += `Documentos: ${dados.informacoesComplementares.documentosDetalhes}\n`;
    }
    mensagem += `Houve tentativa de resolução extrajudicial: ${dados.informacoesComplementares.tentativaExtrajudicial ? "Sim" : "Não"}\n`;
    mensagem += `O cliente deseja propor acordo: ${dados.informacoesComplementares.propostaAcordo ? "Sim" : "Não"}\n`;
    if (dados.informacoesComplementares.propostaAcordo) {
      mensagem += `Valor sugerido para acordo: ${dados.informacoesComplementares.valorAcordo}\n`;
    }
    mensagem += "\n";
    
    if (dados.detalhesAdicionais) {
      mensagem += `DETALHES ADICIONAIS:\n${dados.detalhesAdicionais}\n\n`;
    }
    
    return mensagem;
  };
  
  const formatarDadosIndenizatorios = (dados: DadosIndenizatoria): string => {
    let mensagem = "DADOS DO AUTOR:\n";
    mensagem += `Nome: ${dados.autor.nome}\n`;
    mensagem += `CPF: ${dados.autor.cpf}\n`;
    mensagem += `RG: ${dados.autor.rg}\n`;
    mensagem += `Endereço: ${dados.autor.endereco}\n`;
    mensagem += `Telefone: ${dados.autor.telefone}\n`;
    mensagem += `Email: ${dados.autor.email}\n`;
    mensagem += `Estado Civil: ${dados.autor.estadoCivil}\n`;
    mensagem += `Profissão: ${dados.autor.profissao}\n\n`;
    
    mensagem += "DADOS DO RÉU:\n";
    mensagem += `Nome/Razão Social: ${dados.reu.nome}\n`;
    mensagem += `CPF/CNPJ: ${dados.reu.cpfCnpj}\n`;
    mensagem += `Endereço: ${dados.reu.endereco}\n\n`;
    
    mensagem += "INFORMAÇÕES DA CAUSA:\n";
    mensagem += `Tipo de Dano: ${getTipoDanoTexto(dados.causa.tipoDano)}\n`;
    mensagem += `Data do Evento: ${dados.causa.dataEvento}\n`;
    mensagem += `Local do Evento: ${dados.causa.localEvento}\n`;
    mensagem += `Descrição do Fato: ${dados.causa.descricao}\n`;
    mensagem += `Valor do Prejuízo Material: ${dados.causa.valorPrejuizo}\n`;
    mensagem += `Houve Lesão Física: ${dados.causa.lesaoFisica ? "Sim" : "Não"}\n`;
    mensagem += `Houve Tratamento Médico: ${dados.causa.tratamentoMedico ? "Sim" : "Não"}\n`;
    mensagem += `Período de Tratamento: ${dados.causa.periodoTratamento}\n`;
    mensagem += `Houve Sequela Permanente: ${dados.causa.sequelasPermanentes ? "Sim" : "Não"}\n\n`;
    
    mensagem += "PROVAS:\n";
    mensagem += `Possui Documentos Comprobatórios: ${dados.provas.documentos ? "Sim" : "Não"}\n`;
    if (dados.provas.documentos) {
      mensagem += `Documentos: ${dados.provas.documentosDetalhes}\n`;
    }
    mensagem += `Existem Testemunhas: ${dados.provas.testemunhas ? "Sim" : "Não"}\n`;
    mensagem += `Necessidade de Perícia: ${dados.provas.pericia ? "Sim" : "Não"}\n\n`;
    
    mensagem += "PEDIDOS:\n";
    mensagem += `Valor da Indenização por Danos Morais: ${dados.pedidos.valorDanosMorais}\n`;
    mensagem += `Valor da Indenização por Danos Materiais: ${dados.pedidos.valorDanosMateriais}\n`;
    if (dados.pedidos.outrosPedidos) {
      mensagem += `Outros Pedidos: ${dados.pedidos.outrosPedidos}\n`;
    }
    mensagem += `Interesse em Audiência de Conciliação: ${dados.pedidos.interesseConciliacao ? "Sim" : "Não"}\n\n`;
    
    if (dados.detalhesAdicionais) {
      mensagem += `DETALHES ADICIONAIS:\n${dados.detalhesAdicionais}\n\n`;
    }
    
    return mensagem;
  };
  
  const formatarDadosDivorcio = (dados: DadosDivorcio): string => {
    let mensagem = "DADOS DOS CÔNJUGES:\n";
    mensagem += `Nome do Requerente: ${dados.requerente.nome}\n`;
    mensagem += `CPF: ${dados.requerente.cpf}\n`;
    mensagem += `RG: ${dados.requerente.rg}\n`;
    mensagem += `Endereço: ${dados.requerente.endereco}\n`;
    mensagem += `Telefone: ${dados.requerente.telefone}\n`;
    mensagem += `Email: ${dados.requerente.email}\n`;
    mensagem += `Profissão: ${dados.requerente.profissao}\n`;
    mensagem += `Renda Mensal: ${dados.requerente.rendaMensal}\n\n`;
    
    mensagem += `Nome do Cônjuge: ${dados.conjuge.nome}\n`;
    mensagem += `CPF: ${dados.conjuge.cpf}\n`;
    mensagem += `Endereço: ${dados.conjuge.endereco}\n\n`;
    
    mensagem += "INFORMAÇÕES SOBRE O CASAMENTO:\n";
    mensagem += `Data do Casamento: ${dados.casamento.dataCasamento}\n`;
    mensagem += `Regime de Bens: ${dados.casamento.regimeBens}\n`;
    mensagem += `Data da Separação de Fato: ${dados.casamento.dataSeparacaoFato}\n`;
    mensagem += `Existem Filhos da União: ${dados.casamento.filhos ? "Sim" : "Não"}\n\n`;
    
    if (dados.casamento.filhos) {
      mensagem += "INFORMAÇÕES SOBRE FILHOS:\n";
      mensagem += `Nome e Idade dos Filhos: ${dados.filhos.nomesIdades}\n`;
      mensagem += `Proposta de Guarda: ${getGuardaTexto(dados.filhos.guardaProposta)}\n`;
      mensagem += `Proposta de Visitação: ${dados.filhos.visitacao}\n`;
      mensagem += `Valor Proposto para Pensão Alimentícia: ${dados.filhos.pensaoAlimenticia}\n\n`;
    }
    
    mensagem += "INFORMAÇÕES SOBRE BENS:\n";
    mensagem += `Existem Bens a Partilhar: ${dados.bens.existemBens ? "Sim" : "Não"}\n`;
    if (dados.bens.existemBens) {
      mensagem += `Descrição dos Bens: ${dados.bens.descricaoBens}\n`;
      mensagem += `Proposta de Partilha: ${dados.bens.propostaPartilha}\n`;
    }
    mensagem += "\n";
    
    mensagem += "INFORMAÇÕES SOBRE DÍVIDAS:\n";
    mensagem += `Existem Dívidas em Comum: ${dados.dividas.existemDividas ? "Sim" : "Não"}\n`;
    if (dados.dividas.existemDividas) {
      mensagem += `Descrição das Dívidas: ${dados.dividas.descricaoDividas}\n`;
      mensagem += `Proposta de Divisão: ${dados.dividas.propostaDivisao}\n`;
    }
    mensagem += "\n";
    
    mensagem += "OUTROS PEDIDOS:\n";
    mensagem += `Retomada do Nome de Solteiro(a): ${dados.outrosPedidos.retomadaNome ? "Sim" : "Não"}\n`;
    mensagem += `Pedido de Alimentos para um dos Cônjuges: ${dados.outrosPedidos.alimentosConjuge ? "Sim" : "Não"}\n`;
    mensagem += `Interesse em Audiência de Conciliação: ${dados.outrosPedidos.interesseConciliacao ? "Sim" : "Não"}\n\n`;
    
    if (dados.detalhesAdicionais) {
      mensagem += `DETALHES ADICIONAIS:\n${dados.detalhesAdicionais}\n\n`;
    }
    
    return mensagem;
  };
  
  const formatarDadosHabeasCorpus = (dados: DadosHabeasCorpus): string => {
    let mensagem = "DADOS DO PACIENTE:\n";
    mensagem += `Nome: ${dados.paciente.nome}\n`;
    mensagem += `CPF: ${dados.paciente.cpf}\n`;
    mensagem += `RG: ${dados.paciente.rg}\n`;
    mensagem += `Data de Nascimento: ${dados.paciente.dataNascimento}\n`;
    mensagem += `Filiação: ${dados.paciente.filiacao}\n`;
    mensagem += `Endereço: ${dados.paciente.endereco}\n`;
    mensagem += `Local onde se encontra recolhido: ${dados.paciente.localRecolhimento}\n\n`;
    
    mensagem += "DADOS DO COATOR:\n";
    mensagem += `Autoridade Coatora: ${dados.coator.autoridade}\n`;
    mensagem += `Cargo/Função: ${dados.coator.cargo}\n`;
    mensagem += `Local de Exercício da Função: ${dados.coator.localExercicio}\n\n`;
    
    mensagem += "INFORMAÇÕES SOBRE A COAÇÃO:\n";
    mensagem += `Data da Prisão ou Ameaça: ${dados.coacao.dataPrisao}\n`;
    mensagem += `Local da Prisão ou Ameaça: ${dados.coacao.localPrisao}\n`;
    mensagem += `Número do Processo: ${dados.coacao.numeroProcesso}\n`;
    mensagem += `Vara ou Tribunal onde tramita o processo: ${dados.coacao.varaProcesso}\n`;
    mensagem += `Descrição da Situação de Constrangimento Ilegal: ${dados.coacao.descricaoConstrangimento}\n`;
    mensagem += `Fundamento Jurídico do Pedido: ${dados.coacao.fundamentoJuridico}\n`;
    mensagem += `Existe Risco Iminente: ${dados.coacao.riscoIminente ? "Sim" : "Não"}\n\n`;
    
    mensagem += "PROVAS:\n";
    mensagem += `Documentos que comprovam a ilegalidade: ${dados.provas.documentos}\n`;
    mensagem += `Tentativa prévia de resolução: ${dados.provas.tentativaPrevia ? "Sim" : "Não"}\n\n`;
    
    mensagem += "PEDIDO:\n";
    mensagem += `Tipo de Habeas Corpus: ${getTipoHabeasCorpusTexto(dados.pedido.tipoHabeasCorpus)}\n`;
    mensagem += `Requer Liminar: ${dados.pedido.liminar ? "Sim" : "Não"}\n`;
    if (dados.pedido.liminar) {
      mensagem += `Justificativa para a Urgência: ${dados.pedido.justificativaUrgencia}\n`;
    }
    mensagem += "\n";
    
    if (dados.detalhesAdicionais) {
      mensagem += `DETALHES ADICIONAIS:\n${dados.detalhesAdicionais}\n\n`;
    }
    
    return mensagem;
  };
  
  const formatarDadosExecucao = (dados: DadosExecucao): string => {
    let mensagem = "DADOS DO EXEQUENTE:\n";
    mensagem += `Nome/Razão Social: ${dados.exequente.nome}\n`;
    mensagem += `CPF/CNPJ: ${dados.exequente.cpfCnpj}\n`;
    mensagem += `RG: ${dados.exequente.rg}\n`;
    mensagem += `Endereço: ${dados.exequente.endereco}\n`;
    mensagem += `Telefone: ${dados.exequente.telefone}\n`;
    mensagem += `Email: ${dados.exequente.email}\n`;
    mensagem += `Estado Civil: ${dados.exequente.estadoCivil}\n`;
    mensagem += `Profissão: ${dados.exequente.profissao}\n\n`;
    
    mensagem += "DADOS DO EXECUTADO:\n";
    mensagem += `Nome/Razão Social: ${dados.executado.nome}\n`;
    mensagem += `CPF/CNPJ: ${dados.executado.cpfCnpj}\n`;
    mensagem += `Endereço: ${dados.executado.endereco}\n`;
    mensagem += `Telefone: ${dados.executado.telefone}\n`;
    mensagem += `Email: ${dados.executado.email}\n\n`;
    
    mensagem += "INFORMAÇÕES SOBRE O TÍTULO:\n";
    mensagem += `Tipo de Título Executivo Extrajudicial: ${dados.titulo.tipoTitulo}\n`;
    mensagem += `Data de Emissão: ${dados.titulo.dataEmissao}\n`;
    mensagem += `Data de Vencimento: ${dados.titulo.dataVencimento}\n`;
    mensagem += `Valor Original da Dívida: ${dados.titulo.valorOriginal}\n`;
    mensagem += `Valor Atualizado da Dívida: ${dados.titulo.valorAtualizado}\n`;
    mensagem += `Houve Protesto: ${dados.titulo.protesto ? "Sim" : "Não"}\n`;
    mensagem += `Houve Tentativa de Negociação: ${dados.titulo.tentativaNegociacao ? "Sim" : "Não"}\n\n`;
    
    mensagem += "INFORMAÇÕES SOBRE GARANTIAS:\n";
    mensagem += `Existe Garantia para a Dívida: ${dados.garantias.existeGarantia ? "Sim" : "Não"}\n`;
    if (dados.garantias.existeGarantia) {
      mensagem += `Tipo de Garantia: ${dados.garantias.tipoGarantia}\n`;
      mensagem += `Descrição dos Bens dados em Garantia: ${dados.garantias.descricaoBens}\n`;
    }
    mensagem += `Conhece Outros Bens do Executado: ${dados.garantias.conheceOutrosBens ? "Sim" : "Não"}\n`;
    if (dados.garantias.conheceOutrosBens) {
      mensagem += `Descrição dos Bens Conhecidos: ${dados.garantias.descricaoOutrosBens}\n`;
    }
    mensagem += "\n";
    
    mensagem += "INFORMAÇÕES COMPLEMENTARES:\n";
    mensagem += `Interesse em Audiência de Conciliação: ${dados.complementares.interesseConciliacao ? "Sim" : "Não"}\n`;
    mensagem += `Pedido de Citação Específico: ${dados.complementares.pedidoCitacao}\n`;
    mensagem += `Pedido de Penhora Online (Sisbajud): ${dados.complementares.penhora ? "Sim" : "Não"}\n`;
    mensagem += `Pedido de Restrição de Veículos (Renajud): ${dados.complementares.restricaoVeiculos ? "Sim" : "Não"}\n`;
    mensagem += `Outros Pedidos Específicos: ${dados.complementares.outrosPedidos}\n\n`;
    
    if (dados.detalhesAdicionais) {
      mensagem += `DETALHES ADICIONAIS:\n${dados.detalhesAdicionais}\n\n`;
    }
    
    return mensagem;
  };
  
  // Funções para obter texto descritivo de cada opção
  function getTipoPeticaoTexto(tipo: TipoPeticao): string {
    const mapeamento: Record<TipoPeticao, string> = {
      trabalhista: "Trabalhista",
      indenizatoria: "Inicial Cível (Indenizatória)",
      divorcio: "Divórcio",
      habeas_corpus: "Habeas Corpus",
      execucao: "Execução de Título Extrajudicial",
      outro: "Outro Tipo",
    };
    
    return mapeamento[tipo] || tipo;
  }
  
  function getUrgenciaTexto(urgencia: "baixa" | "media" | "alta"): string {
    const mapeamento = {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
    };
    
    return mapeamento[urgencia] || urgencia;
  }
  
  function getTipoDemissaoTexto(tipo: string): string {
    const mapeamento: Record<string, string> = {
      sem_justa_causa: "Sem Justa Causa",
      com_justa_causa: "Com Justa Causa",
      pedido_demissao: "Pedido de Demissão",
      "": "Não informado",
    };
    
    return mapeamento[tipo] || tipo;
  }
  
  function getTipoDanoTexto(tipo: string): string {
    const mapeamento: Record<string, string> = {
      material: "Material",
      moral: "Moral",
      estetico: "Estético",
      outro: "Outro",
      "": "Não informado",
    };
    
    return mapeamento[tipo] || tipo;
  }
  
  function getGuardaTexto(tipo: string): string {
    const mapeamento: Record<string, string> = {
      compartilhada: "Compartilhada",
      unilateral: "Unilateral",
      "": "Não informado",
    };
    
    return mapeamento[tipo] || tipo;
  }
  
  function getTipoHabeasCorpusTexto(tipo: string): string {
    const mapeamento: Record<string, string> = {
      preventivo: "Preventivo",
      liberatorio: "Liberatório",
      "": "Não informado",
    };
    
    return mapeamento[tipo] || tipo;
  }
  
  // Componente para renderizar o passo de seleção do tipo de petição
  const renderizarSelecaoTipoPeticao = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Selecione o Tipo de Petição</h2>
        <p className="text-zinc-600 text-sm mb-4">
          Escolha o tipo de petição que deseja criar. Cada tipo terá um formulário específico.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="tipo-peticao">
              Tipo de Petição 
              <QuestionTooltip content="Tipo específico de petição a ser elaborada" />
            </Label>
            <Select
              value={tipoPeticaoSelecionada}
              onValueChange={(valor) => setTipoPeticaoSelecionada(valor as TipoPeticao)}
            >
              <SelectTrigger id="tipo-peticao">
                <SelectValue placeholder="Selecione o tipo de petição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trabalhista">Petição Trabalhista</SelectItem>
                <SelectItem value="indenizatoria">Petição Inicial Cível (Indenizatória)</SelectItem>
                <SelectItem value="divorcio">Petição de Divórcio</SelectItem>
                <SelectItem value="habeas_corpus">Petição de Habeas Corpus</SelectItem>
                <SelectItem value="execucao">Petição de Execução de Título Extrajudicial</SelectItem>
                <SelectItem value="outro">Outro Tipo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="caso-prazo">
              Caso/Número do Processo e Prazo (se aplicável) 
              <QuestionTooltip content="Informe o número do processo e prazo limite, se houver" />
            </Label>
            <Input
              id="caso-prazo"
              value={
                tipoPeticaoSelecionada === "trabalhista" ? dadosTrabalhista.casoPrazo :
                tipoPeticaoSelecionada === "indenizatoria" ? dadosIndenizatoria.casoPrazo :
                tipoPeticaoSelecionada === "divorcio" ? dadosDivorcio.casoPrazo :
                tipoPeticaoSelecionada === "habeas_corpus" ? dadosHabeasCorpus.casoPrazo :
                tipoPeticaoSelecionada === "execucao" ? dadosExecucao.casoPrazo :
                dadosOutro.casoPrazo
              }
              onChange={(e) => {
                const valor = e.target.value;
                switch (tipoPeticaoSelecionada) {
                  case "trabalhista":
                    setDadosTrabalhista(prev => ({ ...prev, casoPrazo: valor }));
                    break;
                  case "indenizatoria":
                    setDadosIndenizatoria(prev => ({ ...prev, casoPrazo: valor }));
                    break;
                  case "divorcio":
                    setDadosDivorcio(prev => ({ ...prev, casoPrazo: valor }));
                    break;
                  case "habeas_corpus":
                    setDadosHabeasCorpus(prev => ({ ...prev, casoPrazo: valor }));
                    break;
                  case "execucao":
                    setDadosExecucao(prev => ({ ...prev, casoPrazo: valor }));
                    break;
                  case "outro":
                    setDadosOutro(prev => ({ ...prev, casoPrazo: valor }));
                    break;
                }
              }}
              placeholder="Ex: Processo nº 1234567-89.2023.8.26.0000 - Prazo: 15 dias (10/11/2023)"
            />
          </div>

          <div>
            <Label className="mb-2 block">
              Nível de Urgência 
              <QuestionTooltip content="Indica a prioridade do caso" />
            </Label>
            <RadioGroup 
              value={
                tipoPeticaoSelecionada === "trabalhista" ? dadosTrabalhista.urgencia :
                tipoPeticaoSelecionada === "indenizatoria" ? dadosIndenizatoria.urgencia :
                tipoPeticaoSelecionada === "divorcio" ? dadosDivorcio.urgencia :
                tipoPeticaoSelecionada === "habeas_corpus" ? dadosHabeasCorpus.urgencia :
                tipoPeticaoSelecionada === "execucao" ? dadosExecucao.urgencia :
                dadosOutro.urgencia
              }
              onValueChange={(v) => {
                const valor = v as "baixa" | "media" | "alta";
                switch (tipoPeticaoSelecionada) {
                  case "trabalhista":
                    setDadosTrabalhista(prev => ({ ...prev, urgencia: valor }));
                    break;
                  case "indenizatoria":
                    setDadosIndenizatoria(prev => ({ ...prev, urgencia: valor }));
                    break;
                  case "divorcio":
                    setDadosDivorcio(prev => ({ ...prev, urgencia: valor }));
                    break;
                  case "habeas_corpus":
                    setDadosHabeasCorpus(prev => ({ ...prev, urgencia: valor }));
                    break;
                  case "execucao":
                    setDadosExecucao(prev => ({ ...prev, urgencia: valor }));
                    break;
                  case "outro":
                    setDadosOutro(prev => ({ ...prev, urgencia: valor }));
                    break;
                }
              }}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="baixa" id="urgencia-baixa" />
                <Label htmlFor="urgencia-baixa">Baixa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="media" id="urgencia-media" />
                <Label htmlFor="urgencia-media">Média</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alta" id="urgencia-alta" />
                <Label htmlFor="urgencia-alta">Alta</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        {tipoPeticaoSelecionada === "outro" && (
          <div>
            <Label htmlFor="detalhes-adicionais" className="mb-2 block">
              Detalhes da Petição
              <QuestionTooltip content="Descreva em detalhes todos os elementos necessários para a petição" />
            </Label>
            <Textarea
              id="detalhes-adicionais"
              value={dadosOutro.detalhesAdicionais}
              onChange={(e) => setDadosOutro(prev => ({ ...prev, detalhesAdicionais: e.target.value }))}
              placeholder="Descreva detalhadamente os fatos, as partes envolvidas, os fundamentos jurídicos e os pedidos..."
              className="min-h-[200px]"
            />
          </div>
        )}
      </div>
    );
  };
  
  // Componentes para renderizar os passos de cada tipo de petição
  const renderizarPassoTrabalhista = () => {
    switch (passo) {
      case 2: // Dados do Reclamante
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Dados do Reclamante</h2>
            <p className="text-zinc-600 text-sm">
              Informe os dados pessoais do reclamante.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reclamante-nome">Nome completo</Label>
                <Input
                  id="reclamante-nome"
                  value={dadosTrabalhista.reclamante.nome}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamante: {
                      ...prev.reclamante,
                      nome: e.target.value
                    }
                  }))}
                  placeholder="Nome completo do reclamante"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamante-cpf">CPF</Label>
                <Input
                  id="reclamante-cpf"
                  value={dadosTrabalhista.reclamante.cpf}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamante: {
                      ...prev.reclamante,
                      cpf: e.target.value
                    }
                  }))}
                  placeholder="CPF do reclamante"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamante-rg">RG e órgão expedidor</Label>
                <Input
                  id="reclamante-rg"
                  value={dadosTrabalhista.reclamante.rg}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamante: {
                      ...prev.reclamante,
                      rg: e.target.value
                    }
                  }))}
                  placeholder="RG e órgão expedidor"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamante-endereco">Endereço completo</Label>
                <Input
                  id="reclamante-endereco"
                  value={dadosTrabalhista.reclamante.endereco}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamante: {
                      ...prev.reclamante,
                      endereco: e.target.value
                    }
                  }))}
                  placeholder="Endereço completo do reclamante"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamante-telefone">Telefone</Label>
                <Input
                  id="reclamante-telefone"
                  value={dadosTrabalhista.reclamante.telefone}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamante: {
                      ...prev.reclamante,
                      telefone: e.target.value
                    }
                  }))}
                  placeholder="Telefone para contato"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamante-email">Email</Label>
                <Input
                  id="reclamante-email"
                  value={dadosTrabalhista.reclamante.email}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamante: {
                      ...prev.reclamante,
                      email: e.target.value
                    }
                  }))}
                  placeholder="Email para contato"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamante-estadocivil">Estado civil</Label>
                <Input
                  id="reclamante-estadocivil"
                  value={dadosTrabalhista.reclamante.estadoCivil}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamante: {
                      ...prev.reclamante,
                      estadoCivil: e.target.value
                    }
                  }))}
                  placeholder="Estado civil do reclamante"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamante-datanascimento">Data de nascimento</Label>
                <Input
                  id="reclamante-datanascimento"
                  value={dadosTrabalhista.reclamante.dataNascimento}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamante: {
                      ...prev.reclamante,
                      dataNascimento: e.target.value
                    }
                  }))}
                  placeholder="Data de nascimento"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamante-pis">PIS/PASEP</Label>
                <Input
                  id="reclamante-pis"
                  value={dadosTrabalhista.reclamante.pis}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamante: {
                      ...prev.reclamante,
                      pis: e.target.value
                    }
                  }))}
                  placeholder="Número do PIS/PASEP"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamante-ctps">CTPS (número, série e UF)</Label>
                <Input
                  id="reclamante-ctps"
                  value={dadosTrabalhista.reclamante.ctps}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamante: {
                      ...prev.reclamante,
                      ctps: e.target.value
                    }
                  }))}
                  placeholder="CTPS (número, série e UF)"
                />
              </div>
            </div>
          </div>
        );
        
      case 3: // Dados da Reclamada
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Dados da Reclamada</h2>
            <p className="text-zinc-600 text-sm">
              Informe os dados da empresa reclamada.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="reclamada-razaosocial">Razão social da empresa</Label>
                <Input
                  id="reclamada-razaosocial"
                  value={dadosTrabalhista.reclamada.razaoSocial}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamada: {
                      ...prev.reclamada,
                      razaoSocial: e.target.value
                    }
                  }))}
                  placeholder="Razão social completa da empresa"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamada-cnpj">CNPJ</Label>
                <Input
                  id="reclamada-cnpj"
                  value={dadosTrabalhista.reclamada.cnpj}
                  onChange={(e) => setDadosTrabalhista(prev => ({
                    ...prev,
                    reclamada: {
                      ...prev.reclamada,
                      cnpj: e.target.value
                    }
                  }))}
                  placeholder="CNPJ da empresa"
                />
              </div>
              
              <div>
                <Label htmlFor="reclamada-endereco">Endereço completo</Label>
                <Input
                  id="reclamada-endereco"
                  value={dadosT