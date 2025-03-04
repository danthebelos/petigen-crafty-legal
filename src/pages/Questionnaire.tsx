
import { useState, useRef } from "react";
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
    
    // Adicionando os dados do formulário ao prompt, omitindo campos de endereço individual
    Object.keys(data).forEach(key => {
      // Pular campos individuais de endereço já que temos o endereço completo
      if (!['enderecoReclamante', 'complemento', 'bairro', 'cidade', 'estado', 'cep'].includes(key)) {
        promptContent += `${key}: ${data[key]}\n`;
      }
    });
    
    // Adicionar o endereço completo
    promptContent += `enderecoCompleto: ${enderecoCompleto}\n`;
    
    console.log("Enviando dados para o chat:", promptContent);
    
    // Definir o contexto para o chat
    setPromptContext(promptContent);
    
    // Marcar o formulário como enviado para exibir o chat
    setIsFormSubmitted(true);
    
    toast({
      title: "Dados enviados para o chat",
      description: "Sua petição está sendo gerada automaticamente",
    });
    
    // Enviar automaticamente a mensagem para o chat para gerar a petição
    setTimeout(() => {
      if (window.enviarMensagemParaChat) {
        window.enviarMensagemParaChat("Por favor, gere minha petição completa com base nas informações que enviei.");
      }
    }, 500);
  };

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
            Preencha o formulário abaixo para gerar sua petição personalizada
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
