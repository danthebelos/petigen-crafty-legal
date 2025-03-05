
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Questionnaire = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [promptContext, setPromptContext] = useState<string | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const chatRef = useRef<any>(null);

  const handleFormSubmit = (data: Record<string, any>, document: File | null) => {
    setFormData(data);
    setUploadedDocument(document);
    
    // Verificar o método de entrada escolhido
    const isDocumentMethod = data.inputMethod === "documento";
    
    let promptContent = "";
    
    if (isDocumentMethod) {
      // Para método de documento direto
      promptContent = `Com base no documento anexado e na seguinte descrição breve, gere uma petição ${data.tipo || "jurídica"} completa, extremamente bem fundamentada com no mínimo 7 páginas, incluindo citações doutrinárias e jurisprudenciais pertinentes. A petição deve seguir a formatação e estrutura adequada, com espaçamento correto e todos os elementos necessários. Inclua fundamentação legal detalhada e adequada ao caso.\n\n`;
      
      promptContent += `Tipo de petição: ${data.tipo === "trabalhista" ? "Trabalhista" : 
                      data.tipo === "indenizatoria" ? "Cível (Indenizatória)" : 
                      data.tipo === "divorcio" ? "Divórcio" : 
                      data.tipo === "habeas-corpus" ? "Habeas Corpus" : 
                      data.tipo === "execucao" ? "Execução de Título Extrajudicial" : ""}\n`;
      
      promptContent += `Descrição breve: ${data.descricaoBreve}\n\n`;
      
      promptContent += `IMPORTANTE: Analise cuidadosamente o documento anexado que contém todas as informações detalhadas do caso. O documento é a principal fonte de informações para esta petição.\n`;
    } else {
      // Para método de questionário (fluxo original)
      // Construir o endereço completo
      const endereco = data.enderecoReclamante || '';
      const complemento = data.complemento ? `, ${data.complemento}` : '';
      const bairro = data.bairro ? `, ${data.bairro}` : '';
      const cidade = data.cidade || '';
      const estado = data.estado || '';
      const cep = data.cep ? `, CEP: ${data.cep}` : '';
      
      const enderecoCompleto = `${endereco}${complemento}${bairro}, ${cidade}/${estado}${cep}`;
      
      // Construindo o prompt para enviar para o chat
      promptContent = `Com base nas seguintes informações, gere uma petição ${data.tipo || "jurídica"} completa, extremamente bem fundamentada com no mínimo 7 páginas, incluindo citações doutrinárias e jurisprudenciais pertinentes. A petição deve seguir a formatação e estrutura adequada, com espaçamento correto e todos os elementos necessários. Inclua fundamentação legal detalhada e adequada ao caso.\n\n`;
      
      // Adicionando os dados do formulário ao prompt
      Object.keys(data).forEach(key => {
        // Pular o campo de método de entrada
        if (key === 'inputMethod') return;
        
        // Para verbas trabalhistas, listar apenas as selecionadas
        if (key === 'verbas' && data[key]) {
          promptContent += "Verbas trabalhistas solicitadas:\n";
          if (data.verbas.ferias) promptContent += "- Férias + 1/3\n";
          if (data.verbas.decimoTerceiro) promptContent += "- 13º Salário\n";
          if (data.verbas.fgts) promptContent += "- FGTS\n";
          if (data.verbas.multaRescisoria) promptContent += "- Multa Rescisória (40% FGTS)\n";
          if (data.verbas.avisoPrevio) promptContent += "- Aviso Prévio\n";
          if (data.verbas.horasExtras) promptContent += "- Horas Extras\n";
          if (data.verbas.danoMoral) promptContent += "- Dano Moral\n";
        } 
        // Pular campos individuais de endereço já que temos o endereço completo
        else if (!['enderecoReclamante', 'complemento', 'bairro', 'cidade', 'estado', 'cep', 'descricaoBreve'].includes(key)) {
          promptContent += `${key}: ${data[key]}\n`;
        }
      });
      
      // Adicionar o endereço completo
      promptContent += `enderecoCompleto: ${enderecoCompleto}\n`;
    }
    
    // Adicionar informação sobre o documento anexado
    if (document) {
      promptContent += `\nDocumento anexado: ${document.name}\n`;
      promptContent += `IMPORTANTE: O usuário ${isDocumentMethod ? "enviou um documento principal" : "anexou um documento com informações adicionais"}. Por favor, considere ${isDocumentMethod ? "principalmente" : "também"} todas as informações do documento para ${isDocumentMethod ? "criar" : "complementar"} os fatos e argumentos na petição.\n`;
    }
    
    console.log("Enviando dados para o chat:", promptContent);
    
    // Definir o contexto para o chat
    setPromptContext(promptContent);
    
    // Marcar o formulário como enviado para exibir o chat
    setIsFormSubmitted(true);
    
    toast({
      title: "Dados enviados para o chat",
      description: "Sua petição está sendo gerada automaticamente",
    });
  };

  // Efeito para enviar a mensagem após o estado ser atualizado
  useEffect(() => {
    if (isFormSubmitted && promptContext) {
      // Pequeno delay para garantir que o componente chat esteja pronto
      const timer = setTimeout(() => {
        console.log("Tentando enviar mensagem para o chat...");
        if (chatRef.current) {
          console.log("Enviando mensagem via chatRef");
          chatRef.current.enviarMensagem("Por favor, gere minha petição completa com base nas informações que enviei.");
        } else if (window.enviarMensagemParaChat) {
          console.log("Enviando mensagem via window.enviarMensagemParaChat");
          window.enviarMensagemParaChat("Por favor, gere minha petição completa com base nas informações que enviei.");
        } else {
          console.log("Nenhum método disponível para enviar mensagem!");
        }
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isFormSubmitted, promptContext]);

  const handleNewPetition = () => {
    setFormData({});
    setIsFormSubmitted(false);
    setPromptContext(null);
    setUploadedDocument(null);
  };

  // Função para mostrar as verbas selecionadas
  const renderVerbasSelecionadas = () => {
    if (!formData.verbas || formData.tipo !== "trabalhista" || formData.inputMethod === "documento") return null;
    
    const verbas = [];
    if (formData.verbas.ferias) verbas.push("Férias + 1/3");
    if (formData.verbas.decimoTerceiro) verbas.push("13º Salário");
    if (formData.verbas.fgts) verbas.push("FGTS");
    if (formData.verbas.multaRescisoria) verbas.push("Multa Rescisória (40% FGTS)");
    if (formData.verbas.avisoPrevio) verbas.push("Aviso Prévio");
    if (formData.verbas.horasExtras) verbas.push("Horas Extras");
    if (formData.verbas.danoMoral) verbas.push("Dano Moral");
    
    if (verbas.length === 0) return null;
    
    return (
      <div className="mt-3">
        <h4 className="font-medium">Verbas solicitadas:</h4>
        <ul className="list-disc list-inside ml-2 text-sm">
          {verbas.map((verba, index) => (
            <li key={index}>{verba}</li>
          ))}
        </ul>
      </div>
    );
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
            Preencha o formulário ou envie um documento para gerar sua petição personalizada
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {!isFormSubmitted ? (
            <div className="space-y-4">
              <QuestionnaireForm onSubmit={handleFormSubmit} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Dados Enviados para o Chat
                </h2>
                
                <div className="bg-zinc-50 p-4 rounded-lg">
                  <h3 className="font-medium text-zinc-900">
                    Método: {formData.inputMethod === "documento" ? "Envio de Documento" : "Questionário"}
                  </h3>
                  
                  <h3 className="font-medium text-zinc-900 mt-2">
                    Tipo de Petição: {formData.tipo === "trabalhista" ? "Trabalhista" : 
                                    formData.tipo === "indenizatoria" ? "Cível (Indenizatória)" : 
                                    formData.tipo === "divorcio" ? "Divórcio" : 
                                    formData.tipo === "habeas-corpus" ? "Habeas Corpus" : 
                                    formData.tipo === "execucao" ? "Execução de Título Extrajudicial" : ""}
                  </h3>
                  
                  {formData.inputMethod === "documento" && formData.descricaoBreve && (
                    <div className="mt-3">
                      <h4 className="font-medium">Descrição breve:</h4>
                      <p className="text-sm text-zinc-700">{formData.descricaoBreve}</p>
                    </div>
                  )}
                  
                  {renderVerbasSelecionadas()}
                  
                  {uploadedDocument && (
                    <div className="mt-3">
                      <h4 className="font-medium">Documento {formData.inputMethod === "documento" ? "principal" : "anexado"}:</h4>
                      <p className="text-sm text-green-600">{uploadedDocument.name}</p>
                    </div>
                  )}
                  
                  <p className="text-zinc-600 mt-2">
                    Sua petição está sendo gerada automaticamente pelo assistente. Aguarde enquanto processamos os dados.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleNewPetition}
                  >
                    Nova Petição
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">
              Assistente de Petições
            </h2>
            <p className="text-zinc-600">
              {!isFormSubmitted 
                ? "Preencha o formulário primeiro para gerar sua petição" 
                : "Sua petição está sendo gerada automaticamente"}
            </p>
            <ChatInterface
              peticaoId="temp-id" 
              contexto={promptContext || "Preencha o formulário primeiro"}
              ref={chatRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
