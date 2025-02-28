
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
            <QuestionnaireForm onFinalize={handleFinalizePetition} />
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
