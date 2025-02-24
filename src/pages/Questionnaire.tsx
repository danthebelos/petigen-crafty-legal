
import { motion } from "framer-motion";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import ChatInterface from "@/components/ChatInterface";

const Questionnaire = () => {
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
          <QuestionnaireForm />
          
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
      </div>
    </div>
  );
};

export default Questionnaire;
