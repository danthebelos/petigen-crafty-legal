
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Gerador de Petições com IA
        </h1>
        <p className="text-lg text-gray-600">
          Crie petições jurídicas de forma rápida e eficiente com auxílio de
          inteligência artificial.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/auth">Começar Agora</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
