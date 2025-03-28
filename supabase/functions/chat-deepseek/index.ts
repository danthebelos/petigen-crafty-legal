
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY')
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY não configurada')
    }

    const { mensagem, contexto, instrucoes } = await req.json()
    console.log("Recebido:", { mensagem, contexto })

    // Verificar se há informações de advogado no contexto
    const advogadoInfo = contexto.includes("Advogado Responsável:")
      ? "A petição deve incluir todos os dados do advogado que constam no contexto (nome, OAB, email, etc.) nos locais apropriados da petição, incluindo cabeçalho e assinatura."
      : ""; 

    // Configurar prompt do sistema
    let systemPrompt = `Você é um assistente jurídico especializado em gerar petições de alta qualidade. Você deve gerar uma petição completa com base nas informações do formulário, mantendo a linguagem formal e técnica apropriada, incluindo todas as partes que compõem uma petição jurídica adequada. ${advogadoInfo}`;

    const payload = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Contexto da petição: ${contexto}\n\nSolicitação: ${mensagem}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }
    console.log("Enviando para DeepSeek:", payload)

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log("Resposta do DeepSeek:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
      data
    })

    if (!response.ok) {
      throw new Error(data.error?.message || JSON.stringify(data.error) || 'Erro ao se comunicar com o DeepSeek')
    }

    return new Response(JSON.stringify({
      resposta: data.choices[0].message.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Erro detalhado:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
