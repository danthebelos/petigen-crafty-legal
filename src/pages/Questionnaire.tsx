
import { useRef } from "react";
import { motion } from "framer-motion";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import ChatInterface from "@/components/ChatInterface";
import { PeticaoProvider, usePeticaoContext } from "@/components/questionnaire/PeticaoContext";
import PeticaoSubmissionHandler from "@/components/questionnaire/PeticaoSubmissionHandler";
import ChatInitializer from "@/components/questionnaire/ChatInitializer";
import FormDataSummary from "@/components/questionnaire/FormDataSummary";

const QuestionnairePage = () => {
  const chatRef = useRef<any>(null);
  
  return (
    <PeticaoProvider>
      <QuestionnaireContent chatRef={chatRef} />
    </PeticaoProvider>
  );
};

const QuestionnaireContent = ({ chatRef }: { chatRef: React.RefObject<any> }) => {
  const { isFormSubmitted, promptContext } = usePeticaoContext();
  const { handleFormSubmit } = PeticaoSubmissionHandler({ chatRef });
  
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
              <FormDataSummary />
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
      
      <ChatInitializer chatRef={chatRef} />
    </div>
  );
};

export default QuestionnairePage;
