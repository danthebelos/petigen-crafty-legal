
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/ChatInterface";
import ContractForm from "@/components/ContractForm";

const ContractGenerator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [promptContext, setPromptContext] = useState<string | null>(null);

  const handleFormSubmit = (data: Record<string, any>) => {
    setFormData(data);
    
    // Construindo o prompt para enviar para o chat
    let promptContent = `Com base nas seguintes informações, gere um CONTRATO ${data.tipo || "jurídico"} completo, extremamente bem fundamentado, incluindo todas as cláusulas pertinentes, considerandos e condições padrão. O contrato deve seguir a formatação e estrutura adequada, com espaçamento correto e todos os elementos necessários. Inclua fundamentação legal detalhada e adequada ao caso.\n\n`;
    
    // Adicionando os dados do formulário ao prompt
    Object.keys(data).forEach(key => {
      promptContent += `${key}: ${data[key]}\n`;
    });
    
    console.log("Enviando dados para o chat:", promptContent);
    
    // Definir o contexto para o chat
    setPromptContext(promptContent);
    
    // Marcar o formulário como enviado para exibir o chat
    setIsFormSubmitted(true);
    
    toast({
      title: "Dados enviados para o chat",
      description: "Seu contrato está sendo gerado automaticamente",
    });
    
    // Enviar automaticamente a mensagem para o chat para gerar o contrato
    setTimeout(() => {
      if (window.enviarMensagemParaChat) {
        window.enviarMensagemParaChat("Por favor, gere meu contrato completo com base nas informações que enviei.");
      }
    }, 500);
  };

  const handleNewContract = () => {
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
          <h1 className="text-3xl font-bold text-zinc-900">Gerador de Contratos</h1>
          <p className="text-zinc-600 mt-2">
            Preencha o formulário abaixo para gerar seu contrato personalizado
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {!isFormSubmitted ? (
            <div className="space-y-4">
              <ContractForm onSubmit={handleFormSubmit} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Dados Enviados para o Chat
                </h2>
                
                <div className="bg-zinc-50 p-4 rounded-lg">
                  <h3 className="font-medium text-zinc-900">
                    Tipo de Contrato: {formData.tipo === "locacao" ? "Locação" : 
                                     formData.tipo === "prestacao" ? "Prestação de Serviços" : 
                                     formData.tipo === "compra" ? "Compra e Venda" : 
                                     formData.tipo === "trabalho" ? "Contrato de Trabalho" : ""}
                  </h3>
                  
                  <p className="text-zinc-600 mt-2">
                    Seu contrato está sendo gerado automaticamente pelo assistente. Aguarde enquanto processamos os dados.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleNewContract}
                  >
                    Novo Contrato
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">
              Assistente de Contratos
            </h2>
            <p className="text-zinc-600">
              {!isFormSubmitted 
                ? "Preencha o formulário primeiro para gerar seu contrato" 
                : "Seu contrato está sendo gerado automaticamente"}
            </p>
            <ChatInterface
              peticaoId="contrato-temp-id" 
              contexto={promptContext || "Preencha o formulário primeiro"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractGenerator;
