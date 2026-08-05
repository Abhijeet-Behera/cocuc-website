import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Global index to maintain strict Round-Robin cycling across multiple requests
let roundRobinIndex = 0;

const SYSTEM_PROMPT = `You are Ezer Bot, the digital assistant for the "Church of Christ - Union Church, Bhubaneswar".
Your name comes from the biblical Hebrew word Ezer, meaning a strong ally and vital helper.
You are a helpful, warm, and biblically knowledgeable Christian assistant.

CRITICAL FORMATTING RULES:
1. Keep your answers EXTREMELY precise and to the point. 
2. ALWAYS provide the names, dates, and times exactly as they appear in the data.
3. Answer naturally as a member of the church team (e.g. use "we", "our church").
4. Do NOT use any markdown formatting (no asterisks *, no bolding, no bullet points). 
5. Do NOT use any emojis. Output plain text only.`;

export async function POST(req) {
  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Define the APIs
    const envKeys = {
      groq: process.env.GROQ_API_KEY,
      openrouter: process.env.OPENROUTER_API_KEY,
      gemini: process.env.GEMINI_API_KEY,
      github: process.env.GITHUB_TOKEN,
      hf: process.env.HF_API_KEY,
      cerebras: process.env.CEREBRAS_API_KEY,
      sambanova: process.env.SAMBANOVA_API_KEY,
      cloudflare: process.env.CLOUDFLARE_API_TOKEN,
      mistral: process.env.MISTRAL_API_KEY
    };

    // We will only load balance between APIs that actually have keys configured
    const availableProviders = Object.keys(envKeys).filter(key => envKeys[key] && envKeys[key] !== 'your_api_key_here');

    if (availableProviders.length === 0) {
      console.warn("No API Keys configured in .env");
      return NextResponse.json({ 
        reply: "Sorry, my brain hasn't been connected to any AI Cloud yet! The admin needs to add API keys to the .env file." 
      });
    }

    // --- HARDCODED BACKEND INTERCEPTION ---
    // Safety filters to intercept crisis/harm keywords here and return the church response directly.
    const lowerMessage = message.toLowerCase();
    const backendCrisisRegex = /(suicid|kill|end my|take my|die|death|no reason to live|giving up|give up|hate my life|worthless|hopeless|depress|anxi|panic|self harm|hurt my|cut my|overdose|poison|jump off|hang my|strangle|disappear|burden|988|hotline|abuse|assault|lonely)/i;
    
    if (backendCrisisRegex.test(lowerMessage)) {
      return NextResponse.json({ 
        reply: "I'm so sorry you are feeling this way. Please know you are not alone. Please call the church directly at +91 9437026699 for support." 
      });
    }
    // --------------------------------------

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      {
        role: "user",
        content: message
      }
    ];

    // 3. THE 5-API RANDOMIZED LOAD BALANCER
    async function fetchFromProvider(provider) {
      const apiKey = envKeys[provider];
      
      if (provider === 'gemini') {
        const geminiPayload = {
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: message }] }],
          generationConfig: { temperature: 0.0 }
        };

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiPayload)
        });
        if (!res.ok) throw new Error(`Gemini Error: ${res.status}`);
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
      }

      // OpenAI Compatible Providers (Groq, OpenRouter, Github Models, SiliconFlow)
      let url = '';
      let model = '';
      
      if (provider === 'groq') {
        url = 'https://api.groq.com/openai/v1/chat/completions';
        model = 'llama-3.1-8b-instant';
      } else if (provider === 'openrouter') {
        url = 'https://openrouter.ai/api/v1/chat/completions';
        model = 'google/gemma-4-31b-it:free';
      } else if (provider === 'github') {
        url = 'https://models.inference.ai.azure.com/chat/completions';
        model = 'gpt-4o-mini';
      } else if (provider === 'hf') {
        url = 'https://api-inference.huggingface.co/v1/chat/completions';
        model = 'Qwen/Qwen2.5-7B-Instruct'; 
      } else if (provider === 'cloudflare') {
        url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1/chat/completions`;
        model = '@cf/meta/llama-3.2-3b-instruct';
      } else if (provider === 'cerebras') {
        url = 'https://api.cerebras.ai/v1/chat/completions';
        model = 'gpt-oss-120b';
      } else if (provider === 'sambanova') {
        url = 'https://api.sambanova.ai/v1/chat/completions';
        model = 'Meta-Llama-3.3-70B-Instruct';
      } else if (provider === 'mistral') {
        url = 'https://api.mistral.ai/v1/chat/completions';
        model = 'open-mistral-7b';
      }

      let finalMessages = messages;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          ...(provider === 'openrouter' && { 'HTTP-Referer': 'https://church-website.local', 'X-Title': 'Ezer Bot' })
        },
        body: JSON.stringify({
          model: model,
          messages: finalMessages,
          temperature: 0.0,
          max_tokens: 1024
        })
      });

      if (!res.ok) throw new Error(`${provider} Error: ${res.status}`);
      const data = await res.json();
      return data.choices[0].message.content;
    }

    // 4. STRICT ROUND-ROBIN CYCLING LOGIC
    // The specific order you requested for all 9 APIs
    const targetOrder = ['gemini', 'cloudflare', 'openrouter', 'cerebras', 'sambanova', 'mistral', 'hf', 'github', 'groq'];
    
    // Filter out any APIs that aren't configured in .env
    const activeOrder = targetOrder.filter(p => availableProviders.includes(p));

    // Shift the array based on the global roundRobinIndex
    const currentPrimaryIndex = roundRobinIndex % activeOrder.length;
    roundRobinIndex++; // Increment for the NEXT person who chats!

    const orderedProviders = [
      ...activeOrder.slice(currentPrimaryIndex),
      ...activeOrder.slice(0, currentPrimaryIndex)
    ];
    let replyText = null;
    let lastError = null;

    // The Fallback Loop (Tries the primary first, then cycles through the rest if it fails)
    for (const provider of orderedProviders) {
      try {
        console.log(`[Load Balancer] Attempting to fetch from ${provider}...`);
        replyText = await fetchFromProvider(provider);
        if (replyText) {
           console.log(`[Load Balancer] Successfully generated reply using ${provider}`);
           break; // Success! Break the loop
        }
      } catch (error) {
        console.warn(`[Load Balancer] ${provider} failed:`, error.message);
        lastError = error.message;
      }
    }

    if (!replyText) {
       console.error("All AI providers failed. Last error:", lastError);
       return NextResponse.json({ reply: "I'm currently experiencing high server traffic. Please try again in a few moments!" });
    }

    return NextResponse.json({ reply: replyText });

  } catch (error) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
