
import { useState } from "react";
import { motion } from "framer-motion";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import ChatInterface from "@/components/ChatInterface";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Questionnaire = () => {
  const { toast } = useToast();
  const [generatedPetition, setGeneratedPetition] = useState<string | null>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFormSubmit = (data: Record<string, any>) => {
    setFormData(data);
    setReviewMode(true);
  };

  const handleEditForm = () => {
    setReviewMode(false);
  };

  const handleGeneratePetition = () => {
    setIsAIDialogOpen(true);
    
    // Construindo o prompt para enviar para a IA
    let promptContent = `Com base nas seguintes informações, gere uma petição ${formData.tipo || "jurídica"} completa, extremamente bem fundamentada com no mínimo 5 páginas, incluindo citações doutrinárias e jurisprudenciais pertinentes. A petição deve seguir a formatação e estrutura adequada, com espaçamento correto e todos os elementos necessários. Inclua fundamentação legal detalhada e adequada ao caso.\n\n`;
    
    // Adicionando os dados do formulário ao prompt
    Object.keys(formData).forEach(key => {
      promptContent += `${key}: ${formData[key]}\n`;
    });
    
    console.log("Enviando prompt para a IA:", promptContent);
    
    // Simulando o tempo de processamento da IA
    // Em produção, aqui seria feita a chamada real para a API DeepSeek
    setTimeout(() => {
      const petitionText = generatePetitionText(formData);
      setGeneratedPetition(petitionText);
      setIsAIDialogOpen(false);

      toast({
        title: "Petição gerada com sucesso",
        description: "Agora você pode conversar com a IA para refinar sua petição.",
      });
    }, 3000);
  };

  // Função auxiliar para gerar texto da petição baseado no tipo
  const generatePetitionText = (data: Record<string, any>): string => {
    switch(data.tipo) {
      case "trabalhista":
        return `
        EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DO TRABALHO DA ___ VARA DO TRABALHO DE _____________
        
        ${data.nomeReclamante || 'NOME DO RECLAMANTE'}, brasileiro(a), ${data.estadoCivilReclamante || 'estado civil'}, portador(a) do RG nº ${data.rgReclamante || 'número'} e CPF nº ${data.cpfReclamante || 'número'}, residente e domiciliado(a) na ${data.enderecoReclamante || 'endereço completo'}, vem, respeitosamente, à presença de Vossa Excelência, por seu advogado que esta subscreve, propor a presente
        
        RECLAMAÇÃO TRABALHISTA
        COM PEDIDO DE TUTELA DE URGÊNCIA
        
        em face de ${data.razaoSocialReclamada || 'NOME DA RECLAMADA'}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${data.cnpjReclamada || 'número'}, com sede na ${data.enderecoReclamada || 'endereço completo'}, pelos fatos e fundamentos a seguir expostos.
        
        I - DOS FATOS
        
        O(A) Reclamante foi admitido(a) pela Reclamada em ${data.dataAdmissao || 'data'}, para exercer a função de ${data.funcao || 'função'}, recebendo como último salário o valor de R$ ${data.ultimoSalario || 'valor'}.
        
        [Descrição detalhada dos fatos com base nos dados fornecidos]
        
        II - DO DIREITO
        
        [Fundamentação jurídica baseada na legislação trabalhista]
        
        III - DOS PEDIDOS
        
        Ante o exposto, requer a procedência dos pedidos para condenar a Reclamada a pagar ao Reclamante:
        
        ${data.verbasRescisorias ? `a) Verbas rescisórias não pagas, especificamente: ${data.verbasRescisoriasDetalhe || ''};` : ''}
        ${data.horasExtras ? `b) Horas extras e reflexos, considerando: ${data.horasExtrasDetalhe || ''};` : ''}
        ${data.adicionalNoturno ? `c) Adicional noturno e reflexos, referente a: ${data.adicionalNoturnoDetalhe || ''};` : ''}
        ${data.adicionalInsalubridade ? 'd) Adicional de insalubridade/periculosidade e reflexos;' : ''}
        ${data.equiparacaoSalarial ? `e) Diferenças salariais por equiparação salarial com o paradigma ${data.equiparacaoSalarialDetalhe || ''};` : ''}
        ${data.danosMorais ? `f) Indenização por danos morais no valor de R$ 20.000,00, pelos seguintes fatos: ${data.danosMoraisDetalhe || ''};` : ''}
        ${data.outrosPedidos ? `g) ${data.outrosPedidosDetalhe || ''};` : ''}
        
        h) Juros e correção monetária;
        i) Honorários advocatícios de sucumbência;
        j) Demais direitos decorrentes da relação de emprego.
        
        IV - DOS REQUERIMENTOS
        
        [Requerimentos processuais padrão]
        
        Termos em que,
        Pede deferimento.
        
        [Cidade], [Data].
        
        [Advogado]
        OAB/XX nº XXXXX
      `;

      case "indenizatoria":
        return `
        EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA CÍVEL DA COMARCA DE _____________
        
        ${data.nomeAutor || 'NOME DO AUTOR'}, brasileiro(a), ${data.estadoCivilAutor || 'estado civil'}, ${data.profissaoAutor || 'profissão'}, portador(a) do RG nº ${data.rgAutor || 'número'} e CPF nº ${data.cpfAutor || 'número'}, residente e domiciliado(a) na ${data.enderecoAutor || 'endereço completo'}, vem, respeitosamente, à presença de Vossa Excelência, por seu advogado que esta subscreve, propor a presente
        
        AÇÃO DE INDENIZAÇÃO POR DANOS MORAIS E MATERIAIS
        
        em face de ${data.nomeReu || 'NOME DO RÉU'}, pessoa ${data.cpfCnpjReu?.length > 14 ? 'jurídica' : 'física'}, inscrito(a) no ${data.cpfCnpjReu?.length > 14 ? 'CNPJ' : 'CPF'} sob o nº ${data.cpfCnpjReu || 'número'}, com ${data.cpfCnpjReu?.length > 14 ? 'sede' : 'residência'} na ${data.enderecoReu || 'endereço completo'}, pelos fatos e fundamentos a seguir expostos.
        
        I - DOS FATOS
        
        [Descrição detalhada dos fatos com base na data do evento, local, lesões sofridas e outros dados fornecidos]
        
        II - DO DIREITO
        
        [Fundamentação jurídica da responsabilidade civil]
        
        III - DOS DANOS SOFRIDOS E DO PEDIDO DE INDENIZAÇÃO
        
        [Detalhamento dos danos morais, materiais e pedidos específicos com base nos valores informados]
        
        IV - DOS PEDIDOS
        
        Ante o exposto, requer:
        
        a) A citação do(a) Réu(Ré) para, querendo, contestar a presente ação;
        b) A procedência dos pedidos para condenar o(a) Réu(Ré) ao pagamento de:
            ${data.danoMaterial ? `- Indenização por danos materiais no valor de R$ ${data.valorPrejuizo || '0,00'};` : ''}
            ${data.danoMoral ? `- Indenização por danos morais no valor de R$ ${data.valorDanosMorais || '0,00'};` : ''}
            ${data.danoEstetico ? `- Indenização por danos estéticos no valor de R$ ${data.valorDanoEstetico || '0,00'};` : ''}
        c) A condenação do(a) Réu(Ré) ao pagamento das custas processuais e honorários advocatícios;
        d) A produção de todas as provas em direito admitidas.
        
        Dá-se à causa o valor de R$ ${
          (parseFloat(data.valorDanosMorais || '0') + 
           parseFloat(data.valorDanosMateriais || '0') + 
           parseFloat(data.valorDanoEstetico || '0')).toFixed(2) || '0,00'
        }.
        
        Termos em que,
        Pede deferimento.
        
        [Cidade], [Data].
        
        [Advogado]
        OAB/XX nº XXXXX
      `;

      case "divorcio":
        return `
        EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA DE FAMÍLIA DA COMARCA DE _____________
        
        [NOME DO REQUERENTE], brasileiro(a), [estado civil], [profissão], portador(a) do RG nº [número] e CPF nº [número], residente e domiciliado(a) na [endereço completo], vem, respeitosamente, à presença de Vossa Excelência, por seu advogado que esta subscreve, propor a presente
        
        AÇÃO DE DIVÓRCIO CONSENSUAL
        
        em conjunto com [NOME DO CÔNJUGE], brasileiro(a), [estado civil], [profissão], portador(a) do RG nº [número] e CPF nº [número], residente e domiciliado(a) na [endereço completo], pelos fatos e fundamentos a seguir expostos.
        
        I - DOS FATOS
        
        Os requerentes contraíram matrimônio em [data do casamento], conforme certidão de casamento que segue anexa, sob o regime de [regime de bens].
        
        O casal possui [número] filhos, sendo eles: [nomes e idades dos filhos, se houver].
        
        Os cônjuges encontram-se separados de fato desde [data da separação de fato], não havendo possibilidade de reconciliação.
        
        II - DO ACORDO QUANTO AOS ALIMENTOS, GUARDA E VISITAS DOS FILHOS
        
        [Detalhes sobre guarda, visitas e pensão alimentícia, se houver filhos]
        
        III - DA PARTILHA DE BENS
        
        [Detalhes sobre a partilha de bens e dívidas]
        
        IV - DO DIREITO
        
        [Fundamentação jurídica com base na EC 66/2010 e Código Civil]
        
        V - DOS PEDIDOS
        
        Ante o exposto, requerem:
        
        a) A homologação do presente acordo de divórcio, com a consequente dissolução do vínculo matrimonial;
        b) A homologação do acordo quanto à guarda, visitas e alimentos dos filhos menores;
        c) A homologação da partilha de bens e dívidas conforme acordado;
        d) A expedição do mandado de averbação ao Cartório de Registro Civil competente;
        e) [Se for o caso] A volta do uso do nome de solteiro(a) por parte de [nome do cônjuge que deseja voltar a usar o nome de solteiro].
        
        Dá-se à causa o valor de R$ [valor].
        
        Termos em que,
        Pedem deferimento.
        
        [Cidade], [Data].
        
        [Advogado]
        OAB/XX nº XXXXX
      `;

      case "habeas-corpus":
        return `
        EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA CRIMINAL DA COMARCA DE _____________
        
        [NOME DO IMPETRANTE], brasileiro(a), [estado civil], [profissão], portador(a) do RG nº [número] e CPF nº [número], residente e domiciliado(a) na [endereço completo], vem, respeitosamente, à presença de Vossa Excelência, impetrar a presente
        
        ORDEM DE HABEAS CORPUS
        COM PEDIDO DE LIMINAR
        
        em favor de [NOME DO PACIENTE], brasileiro(a), [estado civil], [profissão], portador(a) do RG nº [número] e CPF nº [número], residente e domiciliado(a) na [endereço completo], atualmente recolhido no [local de prisão], em razão de ato ilegal praticado por [NOME DA AUTORIDADE COATORA], [cargo/função], pelos fatos e fundamentos a seguir expostos.
        
        I - DOS FATOS
        
        [Descrição detalhada dos fatos relacionados à prisão ilegal ou ameaça de prisão]
        
        II - DO DIREITO
        
        [Fundamentação jurídica com base na Constituição Federal e legislação processual penal]
        
        III - DO PEDIDO LIMINAR
        
        [Fundamentação para concessão de liminar]
        
        IV - DOS PEDIDOS
        
        Ante o exposto, requer:
        
        a) A concessão de LIMINAR, determinando a imediata expedição de alvará de soltura em favor do paciente;
        b) A notificação da autoridade coatora para prestar informações no prazo legal;
        c) A oitiva do Ministério Público;
        d) No mérito, a concessão definitiva da ordem de habeas corpus, confirmando a liminar, para que seja relaxada a prisão ilegal do paciente.
        
        Termos em que,
        Pede deferimento.
        
        [Cidade], [Data].
        
        [Advogado]
        OAB/XX nº XXXXX
      `;

      case "execucao":
        return `
        EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA CÍVEL DA COMARCA DE _____________
        
        [NOME DO EXEQUENTE], brasileiro(a), [estado civil], [profissão], portador(a) do RG nº [número] e CPF nº [número], residente e domiciliado(a) na [endereço completo], vem, respeitosamente, à presença de Vossa Excelência, por seu advogado que esta subscreve, propor a presente
        
        AÇÃO DE EXECUÇÃO DE TÍTULO EXTRAJUDICIAL
        
        em face de [NOME DO EXECUTADO], pessoa [física/jurídica], inscrito(a) no [CPF/CNPJ] sob o nº [número], com [residência/sede] na [endereço completo], pelos fatos e fundamentos a seguir expostos.
        
        I - DOS FATOS
        
        [Descrição da relação que originou o título executivo e do inadimplemento]
        
        II - DO TÍTULO EXECUTIVO
        
        [Descrição detalhada do título executivo extrajudicial]
        
        III - DO VALOR DA EXECUÇÃO
        
        [Cálculo detalhado do valor executado, incluindo principal, juros, correção monetária e eventuais multas]
        
        IV - DO DIREITO
        
        [Fundamentação jurídica com base no Código de Processo Civil]
        
        V - DOS PEDIDOS
        
        Ante o exposto, requer:
        
        a) A citação do executado para pagar a dívida no prazo de 3 (três) dias, sob pena de penhora de bens;
        b) Caso não haja pagamento no prazo legal, a expedição de mandado de penhora e avaliação de bens do executado;
        c) A intimação do executado da penhora realizada;
        d) A condenação do executado ao pagamento das custas processuais e honorários advocatícios;
        e) A produção de todas as provas em direito admitidas.
        
        Dá-se à causa o valor de R$ [valor da execução].
        
        Termos em que,
        Pede deferimento.
        
        [Cidade], [Data].
        
        [Advogado]
        OAB/XX nº XXXXX
      `;

      default:
        return "Petição ainda não implementada para este tipo de documento.";
    }
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
            {!reviewMode && !generatedPetition ? (
              <QuestionnaireForm onSubmit={handleFormSubmit} />
            ) : reviewMode && !generatedPetition ? (
              <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Revisão de Dados
                </h2>
                
                <div className="space-y-4 bg-zinc-50 p-6 rounded-lg">
                  <h3 className="font-medium text-zinc-900">
                    Tipo de Petição: {formData.tipo === "trabalhista" ? "Trabalhista" : 
                                    formData.tipo === "indenizatoria" ? "Cível (Indenizatória)" : 
                                    formData.tipo === "divorcio" ? "Divórcio" : 
                                    formData.tipo === "habeas-corpus" ? "Habeas Corpus" : 
                                    formData.tipo === "execucao" ? "Execução de Título Extrajudicial" : ""}
                  </h3>
                  
                  <div className="border-t border-zinc-200 pt-4">
                    <p className="text-zinc-500 text-sm mb-2">
                      Verifique se todos os dados estão corretos antes de gerar a petição.
                    </p>
                    
                    <div className="prose prose-zinc prose-sm max-w-none">
                      <p>
                        Ao prosseguir, o sistema enviará os dados para a IA gerar uma petição baseada nas informações fornecidas.
                        O documento terá pelo menos 5 páginas e será extremamente bem fundamentado, incluindo doutrina e jurisprudência.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={handleEditForm}>
                    Editar Dados
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleGeneratePetition}
                  >
                    Gerar Petição com IA
                  </Button>
                </div>
              </div>
            ) : generatedPetition ? (
              <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 space-y-6">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Petição Gerada
                </h2>
                
                <div className="bg-zinc-50 p-4 rounded-lg prose prose-zinc prose-sm max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{generatedPetition}</pre>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => {
                      toast({
                        title: "Petição finalizada",
                        description: "Sua petição foi salva com sucesso.",
                      });
                    }}
                  >
                    Finalizar Petição
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">
              Assistente de Petições
            </h2>
            <p className="text-zinc-600">
              {generatedPetition 
                ? "Converse com nosso assistente para melhorar sua petição" 
                : "Gere sua petição primeiro para conversar com nosso assistente"}
            </p>
            <ChatInterface
              peticaoId="temp-id" 
              contexto={generatedPetition || "Gere sua petição primeiro"}
            />
          </div>
        </div>

        {/* Dialog de processamento da IA */}
        <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Gerando sua petição</DialogTitle>
              <DialogDescription className="text-center">
                Nossa IA está criando uma petição completa e bem fundamentada com pelo menos 5 páginas
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              <p className="mt-4 text-center text-zinc-600">
                Estamos gerando uma petição completa e bem fundamentada com base nos seus dados. Isso pode levar alguns instantes...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Questionnaire;
