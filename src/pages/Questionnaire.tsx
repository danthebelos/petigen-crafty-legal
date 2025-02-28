
import { useState } from "react";
import { motion } from "framer-motion";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import ChatInterface from "@/components/ChatInterface";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Circle, Square, Triangle, Diamond, Check, Hexagon, Octagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Questionnaire = () => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [generatedPetition, setGeneratedPetition] = useState<string | null>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const templates = [
    {
      id: 1,
      name: "Clássico Preto",
      icon: <Octagon className="h-6 w-6" />,
      description: "Design elegante e formal com tons de preto",
      color: "bg-zinc-900 text-white",
      gradient: "bg-gradient-to-b from-zinc-900 to-zinc-800",
      highlight: "border-l-4 border-zinc-500",
      preview: "bg-gradient-to-b from-zinc-900 to-zinc-800"
    },
    {
      id: 2,
      name: "Carvão Moderno",
      icon: <Square className="h-6 w-6" />,
      description: "Design contemporâneo com tons de carvão",
      color: "bg-zinc-800 text-zinc-100",
      gradient: "bg-gradient-to-b from-zinc-800 to-zinc-700",
      highlight: "border-l-4 border-zinc-400",
      preview: "bg-gradient-to-b from-zinc-800 to-zinc-700"
    },
    {
      id: 3,
      name: "Grafite Profissional",
      icon: <Triangle className="h-6 w-6" />,
      description: "Visual profissional em tons de grafite",
      color: "bg-zinc-700 text-zinc-100",
      gradient: "bg-gradient-to-b from-zinc-700 to-zinc-600",
      highlight: "border-l-4 border-zinc-300",
      preview: "bg-gradient-to-b from-zinc-700 to-zinc-600"
    },
    {
      id: 4,
      name: "Cinza Neutro",
      icon: <Diamond className="h-6 w-6" />,
      description: "Design equilibrado com tons neutros de cinza",
      color: "bg-zinc-600 text-white",
      gradient: "bg-gradient-to-b from-zinc-600 to-zinc-500",
      highlight: "border-l-4 border-zinc-300",
      preview: "bg-gradient-to-b from-zinc-600 to-zinc-500"
    },
    {
      id: 5,
      name: "Índigo Escuro",
      icon: <Hexagon className="h-6 w-6" />,
      description: "Visual sofisticado com tons de índigo",
      color: "bg-indigo-900 text-white",
      gradient: "bg-gradient-to-b from-indigo-900 to-indigo-800",
      highlight: "border-l-4 border-indigo-500",
      preview: "bg-gradient-to-b from-indigo-900 to-indigo-800"
    },
    {
      id: 6,
      name: "Azul Marinho",
      icon: <Circle className="h-6 w-6" />,
      description: "Design clássico em azul marinho",
      color: "bg-blue-900 text-white",
      gradient: "bg-gradient-to-b from-blue-900 to-blue-800",
      highlight: "border-l-4 border-blue-500",
      preview: "bg-gradient-to-b from-blue-900 to-blue-800"
    },
    {
      id: 7,
      name: "Azul Profissional",
      icon: <Circle className="h-6 w-6" />,
      description: "Design moderno em azul vibrante",
      color: "bg-blue-700 text-white",
      gradient: "bg-gradient-to-b from-blue-700 to-blue-600",
      highlight: "border-l-4 border-blue-300",
      preview: "bg-gradient-to-b from-blue-700 to-blue-600"
    }
  ];

  const handleFormSubmit = (data: Record<string, any>) => {
    setFormData(data);
    setReviewMode(true);
  };

  const handleEditForm = () => {
    setReviewMode(false);
  };

  const handleGeneratePetition = () => {
    setIsAIDialogOpen(true);
    // Aqui seria a lógica para enviar os dados para a IA
    // e receber a petição gerada
    
    // Simulando o tempo de processamento da IA
    setTimeout(() => {
      const petitionText = `
        EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DO TRABALHO DA ___ VARA DO TRABALHO DE _____________
        
        ${formData.nomeReclamante || 'NOME DO RECLAMANTE'}, brasileiro(a), ${formData.estadoCivilReclamante || 'estado civil'}, portador(a) do RG nº ${formData.rgReclamante || 'número'} e CPF nº ${formData.cpfReclamante || 'número'}, residente e domiciliado(a) na ${formData.enderecoReclamante || 'endereço completo'}, vem, respeitosamente, à presença de Vossa Excelência, por seu advogado que esta subscreve, propor a presente
        
        RECLAMAÇÃO TRABALHISTA
        COM PEDIDO DE TUTELA DE URGÊNCIA
        
        em face de ${formData.razaoSocialReclamada || 'NOME DA RECLAMADA'}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${formData.cnpjReclamada || 'número'}, com sede na ${formData.enderecoReclamada || 'endereço completo'}, pelos fatos e fundamentos a seguir expostos.
        
        I - DOS FATOS
        
        O(A) Reclamante foi admitido(a) pela Reclamada em ${formData.dataAdmissao || 'data'}, para exercer a função de ${formData.funcao || 'função'}, recebendo como último salário o valor de R$ ${formData.ultimoSalario || 'valor'}.
        
        [Continua com descrição detalhada dos fatos, fundamentação jurídica e pedidos baseados nos dados fornecidos]
        
        II - DO DIREITO
        
        [Extensa fundamentação jurídica com base na legislação trabalhista, jurisprudência e doutrina]
        
        III - DOS PEDIDOS
        
        Ante o exposto, requer a procedência dos pedidos para condenar a Reclamada a pagar ao Reclamante:
        
        ${formData.verbasRescisorias ? `a) Verbas rescisórias não pagas, especificamente: ${formData.verbasRescisoriasDetalhe || ''};` : ''}
        ${formData.horasExtras ? `b) Horas extras e reflexos, considerando: ${formData.horasExtrasDetalhe || ''};` : ''}
        ${formData.adicionalNoturno ? `c) Adicional noturno e reflexos, referente a: ${formData.adicionalNoturnoDetalhe || ''};` : ''}
        ${formData.adicionalInsalubridade ? 'd) Adicional de insalubridade/periculosidade e reflexos;' : ''}
        ${formData.equiparacaoSalarial ? `e) Diferenças salariais por equiparação salarial com o paradigma ${formData.equiparacaoSalarialDetalhe || ''};` : ''}
        ${formData.danosMorais ? `f) Indenização por danos morais no valor de R$ 20.000,00, pelos seguintes fatos: ${formData.danosMoraisDetalhe || ''};` : ''}
        ${formData.outrosPedidos ? `g) ${formData.outrosPedidosDetalhe || ''};` : ''}
        
        h) Juros e correção monetária;
        i) Honorários advocatícios de sucumbência;
        j) Demais direitos decorrentes da relação de emprego.
        
        IV - DOS REQUERIMENTOS
        
        Requer-se:
        
        a) A notificação da Reclamada para, querendo, apresentar defesa, sob pena de revelia e confissão;
        b) A produção de todas as provas em direito admitidas, especialmente depoimento pessoal do representante legal da Reclamada, sob pena de confissão, oitiva de testemunhas, juntada de documentos e perícias;
        c) A condenação da Reclamada ao pagamento das custas processuais e demais despesas;
        d) Os benefícios da justiça gratuita, por não possuir condições de arcar com as custas do processo sem prejuízo do sustento próprio e de sua família;
        
        Dá-se à causa o valor de R$ 50.000,00 para efeitos fiscais.
        
        Termos em que,
        Pede deferimento.
        
        [Cidade], [Data].
        
        [Advogado]
        OAB/XX nº XXXXX
      `;
      
      setGeneratedPetition(petitionText);
      setIsAIDialogOpen(false);
    }, 3000);
  };

  const handleFinalizePetition = () => {
    setShowTemplates(true);
  };

  const handleSelectTemplate = (id: number) => {
    setSelectedTemplate(id);
    // Aqui você pode adicionar lógica para aplicar o template selecionado
    setTimeout(() => {
      setShowTemplates(false);
      // Adicionar lógica para download ou finalização da petição com o template selecionado
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-zinc-900">Criar Nova Petição</h1>
          <p className="text-zinc-600 mt-2">
            Preencha o formulário abaixo para gerar sua petição personalizada
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {!reviewMode && !generatedPetition ? (
              <QuestionnaireForm onSubmit={handleFormSubmit} />
            ) : reviewMode && !generatedPetition ? (
              <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Revisão de Dados
                </h2>
                
                <div className="space-y-4 bg-zinc-50 p-6 rounded-lg">
                  <h3 className="font-medium text-zinc-900">
                    Tipo de Petição: {formData.tipo === "trabalhista" ? "Trabalhista" : 
                                    formData.tipo === "indenizatoria" ? "Cível (Indenizatória)" : 
                                    formData.tipo === "divorcio" ? "Divórcio" : 
                                    formData.tipo === "habeas-corpus" ? "Habeas Corpus" : 
                                    formData.tipo === "execucao" ? "Execução de Título Extrajudicial" : ""}
                  </h3>
                  
                  <div className="border-t border-zinc-200 pt-4">
                    <p className="text-zinc-500 text-sm mb-2">
                      Verifique se todos os dados estão corretos antes de gerar a petição.
                    </p>
                    
                    <div className="prose prose-zinc prose-sm max-w-none">
                      <p>
                        Ao prosseguir, o sistema enviará os dados para a IA gerar uma petição baseada nas informações fornecidas.
                        O documento poderá ser editado posteriormente, se necessário.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={handleEditForm}>
                    Editar Dados
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleGeneratePetition}
                  >
                    Gerar petição com IA
                  </Button>
                </div>
              </div>
            ) : generatedPetition ? (
              <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Petição Gerada
                </h2>
                
                <div className="bg-zinc-50 p-4 rounded-lg prose prose-zinc prose-sm max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{generatedPetition}</pre>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleFinalizePetition}
                  >
                    Finalizar Petição
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">
              Assistente de Petições
            </h2>
            <p className="text-zinc-600">
              Converse com nosso assistente para melhorar sua petição
            </p>
            <ChatInterface
              peticaoId="temp-id" // Será substituído pelo ID real da petição
              contexto="Exemplo de contexto" // Será substituído pelo contexto real
            />
          </div>
        </div>

        {/* Dialog de processamento da IA */}
        <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Gerando sua petição</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              <p className="mt-4 text-center text-zinc-600">
                Nossa IA está trabalhando na sua petição. Isso pode levar alguns instantes...
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de seleção de templates */}
        <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Escolha um modelo para sua petição
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className={cn(
                    "relative flex flex-col border rounded-lg overflow-hidden cursor-pointer transition-all duration-200",
                    selectedTemplate === template.id 
                      ? "ring-2 ring-primary ring-offset-2" 
                      : "hover:shadow-md"
                  )}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className={cn("p-4", template.gradient)}>
                    <div className="flex items-center justify-between">
                      {template.icon}
                      {selectedTemplate === template.id && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="h-20" /> {/* Espaço para a pré-visualização */}
                  </div>
                  
                  <div className="p-4 bg-white">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{template.description}</p>
                  </div>
                  
                  <div className={cn("h-1", template.color)} />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setShowTemplates(false)}>
                Cancelar
              </Button>
              <Button 
                disabled={selectedTemplate === null}
                onClick={() => {
                  if (selectedTemplate !== null) {
                    handleSelectTemplate(selectedTemplate);
                  }
                }}
              >
                Confirmar seleção
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Questionnaire;
