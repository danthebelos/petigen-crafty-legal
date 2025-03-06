
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
  const chatRef = useRef<any>(null);

  const handleFormSubmit = (data: Record<string, any>) => {
    setFormData(data);
    
    // Construir o endereço completo
    const endereco = data.enderecoReclamante || '';
    const complemento = data.complemento ? `, ${data.complemento}` : '';
    const bairro = data.bairro ? `, ${data.bairro}` : '';
    const cidade = data.cidade || '';
    const estado = data.estado || '';
    const cep = data.cep ? `, CEP: ${data.cep}` : '';
    
    const enderecoCompleto = `${endereco}${complemento}${bairro}, ${cidade}/${estado}${cep}`;
    
    // Construindo o prompt para enviar para o chat
    let promptContent = `Com base nas seguintes informações, gere uma petição ${data.tipo || "jurídica"} completa, extremamente bem fundamentada com no mínimo 7 páginas, incluindo citações doutrinárias e jurisprudenciais pertinentes. A petição deve seguir a formatação e estrutura adequada, com espaçamento correto e todos os elementos necessários. Inclua fundamentação legal detalhada e adequada ao caso.\n\n`;
    
    // Adicionando os dados do formulário ao prompt
    promptContent += `Tipo de petição: ${data.tipo}\n`;
    promptContent += `Nome do reclamante: ${data.nomeReclamante}\n`;
    promptContent += `CPF do reclamante: ${data.cpfReclamante}\n`;
    promptContent += `RG do reclamante: ${data.rgReclamante}\n`;
    promptContent += `Endereço completo: ${enderecoCompleto}\n`;
    promptContent += `Email do reclamante: ${data.emailReclamante}\n`;
    promptContent += `Telefone do reclamante: ${data.telefoneReclamante}\n\n`;
    
    // Dados da empresa
    promptContent += `Nome da empresa reclamada: ${data.nomeReclamada}\n`;
    promptContent += `Razão social da reclamada: ${data.razaoSocialReclamada}\n`;
    promptContent += `CNPJ da reclamada: ${data.cnpjReclamada}\n`;
    promptContent += `Endereço da reclamada: ${data.enderecoReclamada}\n`;
    promptContent += `Email da reclamada: ${data.emailReclamado}\n`;
    promptContent += `Telefone da reclamada: ${data.telefoneReclamado}\n\n`;
    
    // Informações principais do caso
    promptContent += `Descrição dos fatos: ${data.descricaoFatos}\n`;
    if (data.argumentos) promptContent += `Argumentos adicionais: ${data.argumentos}\n`;
    if (data.pedidos) promptContent += `Pedidos específicos: ${data.pedidos}\n`;
    
    // Verbas trabalhistas selecionadas
    if (data.verbasTrabalhistas && data.verbasTrabalhistas.length > 0) {
      promptContent += `\nVerbas trabalhistas solicitadas:\n`;
      data.verbasTrabalhistas.forEach((verba: string) => {
        promptContent += `- ${verba}\n`;
      });
    }
    
    // Opções selecionadas
    promptContent += `\nOpções selecionadas:`;
    promptContent += `\n- Juízo 100% Digital: ${data.juizoDigital ? "Sim" : "Não"}`;
    promptContent += `\n- Solicita Justiça Gratuita: ${data.solicitaJusticaGratuita ? "Sim" : "Não"}`;
    
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
            Preencha o formulário para gerar sua petição personalizada
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
                    Tipo de Petição: {formData.tipo === "trabalhista" ? "Trabalhista" : 
                                    formData.tipo === "indenizatoria" ? "Cível (Indenizatória)" : 
                                    formData.tipo === "divorcio" ? "Divórcio" : 
                                    formData.tipo === "habeas-corpus" ? "Habeas Corpus" : 
                                    formData.tipo === "execucao" ? "Execução de Título Extrajudicial" : ""}
                  </h3>
                  
                  <div className="mt-3">
                    <h4 className="font-medium">Reclamante:</h4>
                    <p className="text-sm text-zinc-700">{formData.nomeReclamante}</p>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="font-medium">Reclamada:</h4>
                    <p className="text-sm text-zinc-700">{formData.nomeReclamada || formData.razaoSocialReclamada}</p>
                  </div>
                  
                  {formData.verbasTrabalhistas && formData.verbasTrabalhistas.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium">Verbas solicitadas:</h4>
                      <p className="text-sm text-zinc-700">
                        {formData.verbasTrabalhistas.length} verbas selecionadas
                      </p>
                    </div>
                  )}
                  
                  <p className="text-zinc-600 mt-4">
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
