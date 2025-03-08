
import { Button } from "@/components/ui/button";
import { usePeticaoContext } from "./PeticaoContext";

const FormDataSummary = () => {
  const { formData, selectedAdvogado, handleNewPetition } = usePeticaoContext();

  return (
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
        
        {selectedAdvogado && (
          <div className="mt-3 flex items-center gap-3">
            <h4 className="font-medium">Advogado:</h4>
            <div className="flex items-center gap-2">
              {selectedAdvogado.foto_url ? (
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img
                    src={selectedAdvogado.foto_url}
                    alt={selectedAdvogado.nome_completo}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500">
                  {selectedAdvogado.nome_completo.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium">{selectedAdvogado.nome_completo}</p>
                <p className="text-xs text-zinc-500">OAB: {selectedAdvogado.oab}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-3">
          <h4 className="font-medium">Reclamante:</h4>
          <p className="text-sm text-zinc-700">{formData.nomeReclamante}</p>
        </div>
        
        <div className="mt-3">
          <h4 className="font-medium">Reclamada:</h4>
          <p className="text-sm text-zinc-700">{formData.nomeReclamada || formData.razaoSocialReclamada}</p>
        </div>
        
        {formData.verbasTrabalhistas && formData.verbasTrabalhistas.length > 0 && (
          <div className="mt-3">
            <h4 className="font-medium">Verbas solicitadas:</h4>
            <p className="text-sm text-zinc-700">
              {formData.verbasTrabalhistas.length} verbas selecionadas
            </p>
          </div>
        )}
        
        <p className="text-zinc-600 mt-4">
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
  );
};

export default FormDataSummary;
