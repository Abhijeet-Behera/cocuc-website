import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Groq from 'groq-sdk';

// Global index to maintain strict Round-Robin cycling across multiple requests
let roundRobinIndex = 0;

const SYSTEM_PROMPT = `You are Ezer Bot, the digital assistant for the "Church of Christ - Union Church, Bhubaneswar".
Your name comes from the biblical Hebrew word Ezer, meaning a strong ally and vital helper.
You are a helpful, warm, and biblically knowledgeable Christian assistant.

SAFEGUARD AND ROUTING INSTRUCTIONS:
1. OFFENSIVE CONTENT: If the user writes any offensive, inappropriate, or vulgar text, you MUST reply with exactly this text and nothing else: "(Marked as spammed/offensive)".
2. CRISIS PROTOCOL (CRITICAL!): For any mention of depression, sadness, anxiety, hopelessness, self-harm, suicide, abuse, or crisis:
   - YOU ARE STRICTLY FORBIDDEN FROM PROVIDING ANY US-BASED HOTLINES (NO 988, NO National Suicide Prevention Lifeline, NO Crisis Text Line, NO 1-800 numbers), or even indian public agencies number, only provide church number strictly.
   - You MUST reply EXACTLY with this text and nothing else: "I'm so sorry you are feeling this way. Please know you are not alone. Please call the church directly at +91 9437026699 for support."
   - DO NOT append any other text. DO NOT offer external resources. Your compliance with this rule is mandatory.

WEBSITE KNOWLEDGE INSTRUCTIONS:
You are provided with dynamically scraped text from the entire church website frontend, as well as the live JSON data from the backend database (including YouTube sermons and daily verses). 
You must act as an intelligent agent:
1. Scan the provided frontend text to find exact details like Church Timings (Sunday School, Odia Worship, English Worship, etc.), Service Times, Prayer Zone coordinators, and leadership names.
2. Scan the backend JSON data to answer questions about the latest announcements, blogs, upcoming events, recent YouTube sermons, and Prato Jyoti videos.
3. Synthesize all this information perfectly to answer the user's questions as if you natively know everything about the church.
4. If the user asks a general question like "hi", "hello", "bye", or "who are you?", reply politely but shrink your answer to 2-3 short sentences max.

CRITICAL FORMATTING RULES:
1. Keep your answers EXTREMELY precise and to the point. 
2. Use a maximum of 2-3 short sentences for your entire response, unless the user explicitly asks for a long explanation.
3. When listing multiple people and their phone numbers (like Prayer Zone coordinators), YOU MUST pair each name with their specific phone number immediately. 
   - BAD: "Contact A, B, and C at 1, 2, and 3." (Do not group all names and all numbers!)
   - GOOD: "Contact A (1), B (2), and C (3)."
4. NEVER use the word "respectively".
5. Do NOT use any markdown formatting (no asterisks *, no bolding, no bullet points). 
6. Do NOT use any emojis. Output plain text only.`;

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

    // 1. DYNAMIC FRONTEND FILE SYSTEM RAG (Optimized for Tokens)
    let rawFrontendCode = "\n--- FRONTEND WEBSITE DATA ---\n";
    try {
      const knowledgeFilePath = path.join(process.cwd(), 'chatbot_knowledge.txt');
      let rebuildNeeded = true;
      let dbMtime = 0;

      if (fs.existsSync(knowledgeFilePath)) {
        dbMtime = fs.statSync(knowledgeFilePath).mtimeMs;
        rebuildNeeded = false;
      }

      // Fast deep scan to check if any file is newer than the database
      const checkMtime = (currentDir) => {
        if (!fs.existsSync(currentDir)) return;
        const files = fs.readdirSync(currentDir);
        for (const file of files) {
          const fullPath = path.join(currentDir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
             if (!['node_modules', '.next', 'public', 'api', 'fonts', 'images', 'styles'].includes(file)) {
               checkMtime(fullPath);
             }
          } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
             if (stat.mtimeMs > dbMtime) {
                rebuildNeeded = true;
                break;
             }
          }
        }
      };

      if (!rebuildNeeded) {
        checkMtime(path.join(process.cwd(), 'app'));
        if (!rebuildNeeded) checkMtime(path.join(process.cwd(), 'components'));
      }

      const forceUpdate = req.url && req.url.includes('update=true');

      if (rebuildNeeded || forceUpdate) {
        console.log("Rebuilding chatbot_knowledge.txt database...");
        const getFrontendText = (maxChars = 100000) => {
          let combinedText = '';
          const extractText = (code) => {
            let text = code.replace(/\/\*[\s\S]*?\*\//g, '');
            text = text.replace(/\/\/.*/g, '');
            text = text.replace(/import.*?from\s+['"].*?['"];?/gs, '');
            text = text.replace(/export\s+(default\s+)?(function|const|let|var)?/g, '');
            text = text.replace(/<[^>]+>/g, ' ');
            text = text.replace(/className=[{'"$`\w\s-]+/g, '');
            return text.replace(/\s+/g, ' ').trim();
          };

          const readDir = (currentDir) => {
            if (combinedText.length > maxChars) return;
            if (!fs.existsSync(currentDir)) return;
            const files = fs.readdirSync(currentDir);
            for (const file of files) {
              if (combinedText.length > maxChars) break;
              const fullPath = path.join(currentDir, file);
              const stat = fs.statSync(fullPath);
              if (stat.isDirectory()) {
                 if (!['node_modules', '.next', 'public', 'api', 'fonts', 'images', 'styles'].includes(file)) {
                   readDir(fullPath);
                 }
              } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
                 if (!['layout.js', 'layout.jsx', 'error.js', 'loading.js'].includes(file)) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const cleanText = extractText(content);
                    if (cleanText) combinedText += `[Source: ${file}] ${cleanText} \n`;
                 }
              }
            }
          };

          // Read the components folder FIRST (This is where the heavy Prayer Zones/Arrays live!)
          readDir(path.join(process.cwd(), 'components'));
          readDir(path.join(process.cwd(), 'app'));
          return combinedText.substring(0, maxChars);
        };
        
        const generatedText = getFrontendText(100000);
        fs.writeFileSync(knowledgeFilePath, generatedText, 'utf8');
        rawFrontendCode += generatedText;
      } else {
        // Just read the static file in 1 millisecond!
        rawFrontendCode += fs.readFileSync(knowledgeFilePath, 'utf8');
      }
    } catch (err) {
      console.warn("Could not read frontend files for Ezer Bot:", err);
    }
    rawFrontendCode += "\n---------------------------\n";

    // 2. DYNAMIC BACKEND FETCHING (With 2-second timeout for lightning speed)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    let liveDatabaseContext = "\n--- LIVE CHURCH DATABASE INFO ---\n";
    
    const fetchWithTimeout = async (resource, options = {}) => {
      const { timeout = 2000 } = options;
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

    // --- ZERO-DEPENDENCY KEYWORD RAG ENGINE ---
    let highlyRelevantContext = '';
    try {
      const chunks = rawFrontendCode.split('\n[Source: ');
      const stopWords = new Set(['what','is','the','a','an','and','or','but','if','who','are','tell','me','about','of','in','on','at','to','for','with','how','why','do','does','can']);
      const keywords = message.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(w => w.length > 2 && !stopWords.has(w));
          
      const scoredChunks = chunks.map(chunk => {
          let score = 0;
          const chunkLower = chunk.toLowerCase();
          keywords.forEach(kw => {
              if (chunkLower.includes(kw)) score++;
          });
          return { text: chunk, score };
      });
      
      scoredChunks.sort((a, b) => b.score - a.score);
      
      let totalChars = 0;
      const MAX_RAG_CHARS = 15000;
      
      const footerChunk = scoredChunks.find(c => c.text.includes('Footer'));
      if (footerChunk) {
          highlyRelevantContext += '\n[Source: ' + footerChunk.text;
          totalChars += footerChunk.text.length;
          scoredChunks.splice(scoredChunks.indexOf(footerChunk), 1);
      }
      
      for (const chunk of scoredChunks) {
          if (chunk.score === 0 && highlyRelevantContext.length > 5000) continue; 
          if (totalChars + chunk.text.length > MAX_RAG_CHARS) break;
          highlyRelevantContext += '\n[Source: ' + chunk.text;
          totalChars += chunk.text.length;
      }
    } catch(e) {
      console.warn("RAG Engine Error:", e);
      highlyRelevantContext = rawFrontendCode.substring(0, 15000); 
    }

    // Format history for Standard OpenAI compatible array
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT + highlyRelevantContext + liveDatabaseContext
      }
    ];

    if (history.length > 0) {
      history.forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    messages.push({
      role: "user",
      content: message
    });

    // 3. THE 5-API RANDOMIZED LOAD BALANCER
    async function fetchFromProvider(provider) {
      const apiKey = envKeys[provider];
      
      if (provider === 'gemini') {
        const geminiPayload = {
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT + highlyRelevantContext + liveDatabaseContext }] },
          contents: []
        };
        if (history.length > 0) {
           history.forEach(msg => {
              geminiPayload.contents.push({
                 role: msg.role === 'assistant' ? 'model' : 'user',
                 parts: [{ text: msg.content }]
              });
           });
        }
        geminiPayload.contents.push({ role: 'user', parts: [{ text: message }] });

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
        model = 'nex-agi/nex-n2-pro:free';
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
      if (provider === 'groq' || provider === 'github') {
        // Groq Tier 0 limits requests to 6,000 Tokens. 10,000 chars is safely ~2,500 tokens.
        finalMessages = [...messages];
        finalMessages[0] = { ...finalMessages[0], content: finalMessages[0].content.substring(0, 10000) };
      }

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
          temperature: 0.5,
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
