
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  Footer,
  ImageRun
} from "docx";

// Função para determinar o tipo de imagem com base na extensão do arquivo
export const getImageFileExtension = (filename: string): "jpg" | "png" | "gif" | "bmp" => {
  const extension = filename.split('.').pop()?.toLowerCase() || "";
  
  if (extension === "jpg" || extension === "jpeg") {
    return "jpg";
  } else if (extension === "gif") {
    return "gif";
  } else if (extension === "bmp") {
    return "bmp";
  } else {
    // Para outras extensões ou desconhecidas, assumir png como padrão seguro
    return "png";
  }
};

export const processarTextoParaDocumentoWord = (texto: string) => {
  // Dividir o texto em parágrafos
  const paragrafos = texto.split('\n\n');
  
  return paragrafos.map(paragrafo => {
    // Verificar se é um título (todo em maiúsculas)
    const ehTitulo = paragrafo.trim() === paragrafo.trim().toUpperCase() && paragrafo.trim().length > 3;
    
    // Processar formatação de negrito e itálico
    const segmentos = [];
    let ultimoIndice = 0;
    
    // Processar negrito
    const regexNegrito = /\*\*(.*?)\*\*/g;
    let matchNegrito;
    while ((matchNegrito = regexNegrito.exec(paragrafo)) !== null) {
      // Adicionar texto antes do negrito
      if (matchNegrito.index > ultimoIndice) {
        segmentos.push(
          new TextRun({
            text: paragrafo.substring(ultimoIndice, matchNegrito.index),
            size: ehTitulo ? 28 : 24,
            bold: ehTitulo,
          })
        );
      }
      
      // Adicionar texto em negrito
      segmentos.push(
        new TextRun({
          text: matchNegrito[1], // O texto dentro dos asteriscos
          size: ehTitulo ? 28 : 24,
          bold: true,
        })
      );
      
      ultimoIndice = matchNegrito.index + matchNegrito[0].length;
    }
    
    // Processar itálico no texto restante
    const textoRestante = paragrafo.substring(ultimoIndice);
    const regexItalico = /\*(.*?)\*/g;
    let ultimoIndiceItalico = 0;
    let matchItalico;
    
    const segmentosRestantes = [];
    
    while ((matchItalico = regexItalico.exec(textoRestante)) !== null) {
      // Adicionar texto antes do itálico
      if (matchItalico.index > ultimoIndiceItalico) {
        segmentosRestantes.push(
          new TextRun({
            text: textoRestante.substring(ultimoIndiceItalico, matchItalico.index),
            size: ehTitulo ? 28 : 24,
            bold: ehTitulo,
          })
        );
      }
      
      // Adicionar texto em itálico
      segmentosRestantes.push(
        new TextRun({
          text: matchItalico[1], // O texto dentro dos asteriscos
          size: ehTitulo ? 28 : 24,
          italics: true,
        })
      );
      
      ultimoIndiceItalico = matchItalico.index + matchItalico[0].length;
    }
    
    // Adicionar texto final se houver
    if (ultimoIndiceItalico < textoRestante.length) {
      segmentosRestantes.push(
        new TextRun({
          text: textoRestante.substring(ultimoIndiceItalico),
          size: ehTitulo ? 28 : 24,
          bold: ehTitulo,
        })
      );
    }
    
    // Se não houver formatação, adicionar o texto completo
    if (segmentos.length === 0 && segmentosRestantes.length === 0) {
      segmentos.push(
        new TextRun({
          text: paragrafo,
          size: ehTitulo ? 28 : 24,
          bold: ehTitulo,
        })
      );
    } else if (segmentosRestantes.length > 0) {
      segmentos.push(...segmentosRestantes);
    }
    
    return new Paragraph({
      children: segmentos,
      spacing: {
        after: 400,
        before: ehTitulo ? 400 : 200,
      },
      alignment: ehTitulo ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    });
  });
};

export const gerarDocumentoWord = async (texto: string, cabeçalhoImagem: File | null, rodapeImagem: File | null, onError: (message: string) => void) => {
  const paragrafos = processarTextoParaDocumentoWord(texto);
  
  let header = undefined;
  let footer = undefined;

  // Adicionar cabeçalho se existir uma imagem
  if (cabeçalhoImagem) {
    try {
      const cabeçalhoBuffer = await cabeçalhoImagem.arrayBuffer();
      const imageExtension = getImageFileExtension(cabeçalhoImagem.name);
      
      header = {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: new Uint8Array(cabeçalhoBuffer),
                  transformation: {
                    width: 600,
                    height: 100,
                  },
                  type: imageExtension,
                  altText: {
                    title: "Cabeçalho",
                    description: "Imagem de cabeçalho do escritório",
                    name: "Cabeçalho"
                  }
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      };
    } catch (error) {
      console.error("Erro ao processar imagem de cabeçalho:", error);
      onError("Não foi possível inserir a imagem de cabeçalho.");
    }
  }

  // Adicionar rodapé se existir uma imagem
  if (rodapeImagem) {
    try {
      const rodapeBuffer = await rodapeImagem.arrayBuffer();
      const imageExtension = getImageFileExtension(rodapeImagem.name);
      
      footer = {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: new Uint8Array(rodapeBuffer),
                  transformation: {
                    width: 600,
                    height: 80,
                  },
                  type: imageExtension,
                  altText: {
                    title: "Rodapé",
                    description: "Imagem de rodapé do escritório",
                    name: "Rodapé"
                  }
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      };
    } catch (error) {
      console.error("Erro ao processar imagem de rodapé:", error);
      onError("Não foi possível inserir a imagem de rodapé.");
    }
  }
  
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1400,
              right: 1000,
              bottom: 1200,
              left: 1000,
            },
          },
        },
        headers: header,
        footers: footer,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO",
                size: 28,
                bold: true,
              }),
            ],
            spacing: { after: 400 },
            alignment: AlignmentType.CENTER,
          }),
          ...paragrafos,
        ],
      },
    ],
  });
};

export const downloadDocument = async (doc: Document, filename: string) => {
  const buffer = await Packer.toBlob(doc);
  const url = URL.createObjectURL(buffer);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
