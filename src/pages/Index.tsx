
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, FileCheck, BarChart, Scale } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-zinc-900 sm:text-5xl">
            Advocacia Digital
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Plataforma completa para advogados com geração de petições, contratos e gestão de escritório com inteligência artificial.
          </p>
          
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 text-center">
              <div className="mx-auto bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Gerador de Petições</h2>
              <p className="text-zinc-600 mb-4">
                Crie petições personalizadas em minutos com fundamentação jurídica completa.
              </p>
              <Button asChild>
                <Link to="/questionnaire">Gerar Petição</Link>
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 text-center">
              <div className="mx-auto bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-green-700" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Gerador de Contratos</h2>
              <p className="text-zinc-600 mb-4">
                Elabore contratos jurídicos seguros e personalizados para diversos fins.
              </p>
              <Button asChild>
                <Link to="/contracts">Gerar Contrato</Link>
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 text-center">
              <div className="mx-auto bg-purple-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-purple-700" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
              <p className="text-zinc-600 mb-4">
                Acompanhe processos, prazos e indicadores do seu escritório.
              </p>
              <Button asChild>
                <Link to="/dashboard">Ver Dashboard</Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-16 flex flex-col items-center">
            <div className="flex items-center justify-center mb-4">
              <Scale className="h-8 w-8 text-zinc-700 mr-2" />
              <h2 className="text-2xl font-semibold text-zinc-900">
                Potencialize seu escritório com IA
              </h2>
            </div>
            <p className="text-zinc-600 max-w-2xl text-center mb-6">
              Nossa plataforma combina tecnologia de ponta com conhecimento jurídico para 
              aumentar a produtividade e reduzir custos do seu escritório.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
