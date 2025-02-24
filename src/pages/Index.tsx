
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <span className="px-3 py-1 text-sm font-medium bg-zinc-100 text-zinc-800 rounded-full inline-block mb-4">
            Geração Inteligente de Petições
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 tracking-tight">
            Crie petições jurídicas
            <span className="block text-zinc-500">em minutos</span>
          </h1>

          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            PetiGen utiliza inteligência artificial avançada para gerar petições jurídicas
            personalizadas, profissionais e precisas em tempo real.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/questionnaire")}
              className="group bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-6 rounded-lg transition-all"
            >
              Criar Petição
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Rápido e Eficiente</h3>
              <p className="text-zinc-600">
                Gere documentos jurídicos completos em questão de minutos, não horas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Personalizado</h3>
              <p className="text-zinc-600">
                Cada petição é adaptada às suas necessidades específicas e contexto legal.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Seguro</h3>
              <p className="text-zinc-600">
                Seus dados são protegidos com criptografia de ponta a ponta.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
