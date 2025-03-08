
import { createContext, useContext, useState } from "react";
import { FormValues } from "@/types/questionnaire";

type Advogado = {
  id: string;
  nome_completo: string;
  oab: string;
  email: string;
  foto_url?: string;
  bio?: string;
};

type PeticaoContextType = {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  isFormSubmitted: boolean;
  setIsFormSubmitted: (value: boolean) => void;
  promptContext: string | null;
  setPromptContext: (context: string | null) => void;
  selectedAdvogado: Advogado | null;
  setSelectedAdvogado: (advogado: Advogado | null) => void;
  handleNewPetition: () => void;
};

const PeticaoContext = createContext<PeticaoContextType | undefined>(undefined);

export const PeticaoProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [promptContext, setPromptContext] = useState<string | null>(null);
  const [selectedAdvogado, setSelectedAdvogado] = useState<Advogado | null>(null);

  const handleNewPetition = () => {
    setFormData({});
    setIsFormSubmitted(false);
    setPromptContext(null);
    setSelectedAdvogado(null);
  };

  return (
    <PeticaoContext.Provider
      value={{
        formData,
        setFormData,
        isFormSubmitted,
        setIsFormSubmitted,
        promptContext,
        setPromptContext,
        selectedAdvogado,
        setSelectedAdvogado,
        handleNewPetition,
      }}
    >
      {children}
    </PeticaoContext.Provider>
  );
};

export const usePeticaoContext = () => {
  const context = useContext(PeticaoContext);
  if (context === undefined) {
    throw new Error("usePeticaoContext must be used within a PeticaoProvider");
  }
  return context;
};
