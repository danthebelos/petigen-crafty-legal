
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
    const { mensagem, contexto } = await req.json()
    console.log("Recebido:", { mensagem, contexto })

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um assistente jurídico especializado em melhorar petições. Você deve fornecer sugestões construtivas e específicas para melhorar o documento, mantendo a linguagem formal e técnica apropriada."
        },
        {
          role: "user",
          content: `Contexto da petição: ${contexto}\n\nSolicitação: ${mensagem}`
        }
      ]
    }
    console.log("Enviando para OpenAI:", payload)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log("Resposta completa da OpenAI:", data)

    if (!response.ok) {
      console.error("Erro da OpenAI:", data)
      throw new Error(data.error?.message || 'Erro ao se comunicar com a API')
    }

    return new Response(JSON.stringify({
      resposta: data.choices[0].message.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Erro detalhado:", error)
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
