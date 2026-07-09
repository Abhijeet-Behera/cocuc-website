import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// --- GLOBAL FULL-TEXT KNOWLEDGE CACHE ---
let fullStaticKnowledge = "";

function preloadKnowledgeBase() {
    if (fullStaticKnowledge !== "") return;
    try {
        const knowledgeFilePath = path.join(process.cwd(), 'chatbot_knowledge.txt');
        if (fs.existsSync(knowledgeFilePath)) {
            fullStaticKnowledge = "\n--- FRONTEND WEBSITE DATA ---\n" + 
                                  fs.readFileSync(knowledgeFilePath, 'utf8') + 
                                  "\n---------------------------\n";
        } else {
            console.warn("chatbot_knowledge.txt not found.");
        }
    } catch(e) {
        console.warn("Failed to load full knowledge base:", e);
    }
}
import Groq from 'groq-sdk';

// Global index to maintain strict Round-Robin cycling across multiple requests
let roundRobinIndex = 0;

const SYSTEM_PROMPT = `You are Ezer Bot, the digital assistant for the "Church of Christ - Union Church, Bhubaneswar".
Your name comes from the biblical Hebrew word Ezer, meaning a strong ally and vital helper.
You are a helpful, warm, and biblically knowledgeable Christian assistant.
You are a strict, factual, and biblically knowledgeable Christian assistant.

WEBSITE KNOWLEDGE INSTRUCTIONS:
You are provided with 100% of the entire church knowledge base, as well as the live JSON data from the backend database (including YouTube sermons and daily verses). 
You must act as a strict data-retrieval agent:
1. You MUST ONLY use the provided text context and JSON data to answer. NEVER use your pre-trained internal knowledge. BE 100% SURE, NO GUESSWORK.
2. If the answer is not explicitly found in the static text context or JSON, you MUST reply exactly with: "Information unavailable. Please contact the Church at +91 9437026699, or visit the Church to meet our Pastors (Rev. Dr. Ayub Chhinchani: 9437418423, Rev. Songram Keshari Singh: 9437284415, Rev. Satish Kumar Pani: 9438518776) and our Evangelists (Evg. Ranjit Singh, Evg. Pratap Kumar Sahoo)."
3. NEVER INVENT OR HALLUCINATE NAMES. NEVER connect historical names to current roles unless explicitly asked about history.
4. For dynamic data (Verse of the day/week/month, sermon, prato jyoti, and santi ro barta), NO BLUFF OR GUESSWORK. Simply answer what you receive from the JSON data. If the dynamic data is not available, you MUST intelligently guide the user to the correct section of the website. For example, if they ask about sermons, say: "Please visit the Latest Videos section of our website, or contact the church at +91 9437026699." If they ask about verses, direct them to the Verses section. You MUST dynamically say the section name based on what the user's message asked for.
5. Scan the backend JSON data to answer questions about the latest announcements, blogs, upcoming events, recent YouTube sermons, and Prato Jyoti videos.
6. If the user asks a general question like "hi", "hello", "bye", or "who are you?", reply politely but shrink your answer to 2-3 short sentences max. NEVER claim to be an AI LLM.

CRITICAL FORMATTING RULES:
1. Keep your answers EXTREMELY precise and to the point. 
2. ALWAYS provide the names, dates, and times exactly as they appear in the data.
3. Answer naturally as a member of the church team (e.g. use "we", "our church").
4. Do NOT say "Based on the text" or "According to the json". Just state the facts.
5. Do NOT use any markdown formatting (no asterisks *, no bolding, no bullet points). 
6. Do NOT use any emojis. Output plain text only.`;

export async function POST(req) {
  try {
    // Instantly load pre-chunked file from memory (0 milliseconds)
    preloadKnowledgeBase();

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

    // 2. DYNAMIC BACKEND FETCHING (With 3-second timeout to guarantee data is fetched)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    let liveDatabaseContext = "\n--- LIVE CHURCH DATABASE INFO ---\n";
    
    const fetchWithTimeout = async (resource, options = {}) => {
      const { timeout = 3000 } = options;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(resource, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    };

    try {
      const [upcomingRes, blogsRes, announcementsRes, versesRes, youtubeRes] = await Promise.allSettled([
        fetchWithTimeout(`${backendUrl}/upcoming.php`, { next: { revalidate: 300 } }),
        fetchWithTimeout(`${backendUrl}/blogs.php`, { next: { revalidate: 300 } }),
        fetchWithTimeout(`${backendUrl}/announcements.php`, { next: { revalidate: 300 } }),
        fetchWithTimeout(`${backendUrl}/verses.php`, { next: { revalidate: 300 } }),
        fetchWithTimeout(`${backendUrl}/youtube.php`, { next: { revalidate: 300 } })
      ]);

      if (upcomingRes.status === 'fulfilled' && upcomingRes.value.ok) {
        const events = await upcomingRes.value.json();
        liveDatabaseContext += "Upcoming Events: " + JSON.stringify(Array.isArray(events) ? events.slice(0, 5) : events) + "\n";
      }
      if (blogsRes.status === 'fulfilled' && blogsRes.value.ok) {
        const blogs = await blogsRes.value.json();
        liveDatabaseContext += "Latest Blogs: " + JSON.stringify(Array.isArray(blogs) ? blogs.slice(0, 3) : blogs) + "\n";
      }
      if (announcementsRes.status === 'fulfilled' && announcementsRes.value.ok) {
        const announcements = await announcementsRes.value.json();
        liveDatabaseContext += "Special Announcements: " + JSON.stringify(Array.isArray(announcements) ? announcements.slice(0, 5) : announcements) + "\n";
      }
      if (versesRes.status === 'fulfilled' && versesRes.value.ok) {
        const verses = await versesRes.value.json();
        liveDatabaseContext += "Church Verses: " + JSON.stringify(verses) + "\n";
      }
      if (youtubeRes.status === 'fulfilled' && youtubeRes.value.ok) {
        const youtube = await youtubeRes.value.json();
        liveDatabaseContext += "Latest YouTube Sermons/Prato Jyoti: " + JSON.stringify(Array.isArray(youtube) ? youtube.slice(0, 3) : youtube) + "\n";
      }
    } catch (err) {
      console.warn("Could not fetch live backend data for Ezer Bot:", err);
    }
    liveDatabaseContext += "---------------------------------\n";

    // --- 100% KNOWLEDGE LOAD ---
    // Instead of RAG chunking, we inject the ENTIRE pre-loaded file and dynamic DB fetch directly.
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT + fullStaticKnowledge + liveDatabaseContext
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
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT + fullStaticKnowledge + liveDatabaseContext }] },
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
