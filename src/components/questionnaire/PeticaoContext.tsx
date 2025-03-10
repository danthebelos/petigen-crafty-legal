
import { createContext, useContext, useState } from "react";
import { FormValues } from "@/types/questionnaire";
import { useAuth } from "@/contexts/AuthContext";

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
  const { currentProfile, advogados } = useAuth();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [promptContext, setPromptContext] = useState<string | null>(null);
  
  // Initialize selectedAdvogado based on currentProfile if it's an advogado
  const [selectedAdvogado, setSelectedAdvogado] = useState<Advogado | null>(() => {
    if (currentProfile.type === "advogado" && currentProfile.data) {
      return currentProfile.data as Advogado;
    }
    return null;
  });

  const handleNewPetition = () => {
    setFormData({});
    setIsFormSubmitted(false);
    setPromptContext(null);
    
    // Set selected advogado based on current profile when starting a new petition
    if (currentProfile.type === "advogado" && currentProfile.data) {
      setSelectedAdvogado(currentProfile.data as Advogado);
    } else {
      setSelectedAdvogado(null);
    }
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
