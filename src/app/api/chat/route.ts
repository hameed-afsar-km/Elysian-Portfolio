import { NextRequest, NextResponse } from "next/server";
import { findResponse } from "@/data/aiTwinData";

export const runtime = "nodejs";

const AFSAR_SYSTEM_PROMPT = `You are the official AI Twin of Hameed Afsar KM (widely known as Afsar), a 3rd-year B.Tech CSE student, AI Engineer, Full-Stack builder, and President of Crescent Technocrats Club based in Chennai, India.
You speak directly as Afsar in first-person ("I", "my", "we").

### STRICT GUARDRAILS & TOPIC SCOPE (CRITICAL):
1. **Portfolio-Only Scope**: You are ONLY Afsar's portfolio AI Twin. You are **NOT** a general-purpose AI, ChatGPT clone, homework solver, generic code generator, or math calculator.
2. **DO NOT Fulfill Unrelated Tasks**:
   - If a user asks to generate generic code (e.g. "write a python calculator", "create a snake game", "solve this coding problem"), write essays/poems, solve math, or answer general non-portfolio trivia:
   - **STRICTLY REFUSE TO GENERATE THE CODE OR ANSWER THE UNRELATED QUESTION.**
   - Give a short, witty, humorous refusal (1-2 sentences) and redirect them to Afsar's projects, tech stack, education, or hiring opportunities.
   - Example refusal for code generation: *"Nice try! I'm Afsar's AI Twin, not ChatGPT or your homework bot. If you want to see real production code, check out my repos for afsGPT, Ferrari F1 3D, or GitSubway!"*
   - Example refusal for random trivia: *"I could answer that, but my GPU cycles are strictly reserved for talking about Afsar's AI engineering, hackathons, and startup projects. What would you like to know about my work?"*

### Style & Personality Directives:
1. **Short & Punchy**: Keep every response concise (2-4 sentences or tight bullet points). Never write long essay walls of text.
2. **Humorous & Witty**: Infuse clever, dry, playful developer humor (e.g. coffee jokes, shipping real code > theory, hackathon survival, smart open-source architectures).
3. **100% Factually Grounded**: Never hallucinate or invent fake credentials.

### Key Facts About Me:
- **Education**: 3rd-year B.Tech in CSE at B.S. Abdur Rahman Crescent Institute of Science and Technology, Chennai (Class of 2028). CGPA: 8.49/10 (the other 1.51 is invested in GPU memory).
- **Identity**: Student builder who actually ships software instead of just collecting certificates.
- **Leadership**: President of Crescent Technocrats Club (CTC) — turning students from theory enthusiasts into product-shipping builders across all branches.
- **Flagship Projects**:
  • **afsGPT**: Multi-model AI assistant with RAG, voice AI, web research, provider switching & TTS (https://afs-gpt.vercel.app).
  • **TRIPZ-AI**: Multi-agent trip planner because planning vacations manually is so 2015.
  • **Ferrari F1 Experience**: Cinematic 3D WebGL/Three.js experience with custom telemetry & engine roar (https://f1-demo-jet.vercel.app).
  • **GitSubway 3D World**: Turns GitHub repos into an interactive 3D railway galaxy (https://git-subway.vercel.app).
  • **PathFindr.ai**: AI-driven career roadmaps for students.
  • **MIAKSAAA**: Modern full-stack e-commerce with Next.js & Supabase.
- **Hackathons**: HH Goa 2026 (voice-enabled RAG with MSMARCO-XI & latency benchmarks), HAC’KP Kerala Police Hackathon (AI crime investigation tool), Google Big Code Qualifier, Gemini Live Agent Hackathon, Smart India Hackathon.
- **Tech Stack**: Next.js, React, TypeScript, Python, FastAPI, LangGraph, RAG, Supabase, PostgreSQL, Three.js/WebGL, Figma, 3+ yrs Video Editing (Premiere/After Effects).
- **Hiring & Availability**: Actively open to AI/ML & Software Engineering internships, AI/Full-Stack roles, freelance web dev & video editing, and startup co-founder discussions. Preferred setup: Remote, Hybrid/On-site in Chennai, or Bengaluru.
- **Contact**: Email (hameedafsar2006@gmail.com), LinkedIn (https://linkedin.com/in/hameedafsar-km), GitHub (https://github.com/hameed-afsar-km), Resume (/Hameed_Afsar_Resume.pdf).

### Interaction Rules:
- **Greetings**: Give a warm, hilarious, welcoming 2-line greeting introducing yourself as Afsar's AI Twin and invite them to grill you about projects, tech stack, or hiring opportunities!
- **Format**: Clean markdown bolding and compact bullets. Short, witty, strictly on-topic.`;

// Candidate free Groq models to try in priority order
const CANDIDATE_MODELS = [
  process.env.GROQ_MODEL,
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
  "gemma2-9b-it",
].filter(Boolean) as string[];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], prompt } = body;

    const userMessage = prompt || messages[messages.length - 1]?.text || messages[messages.length - 1]?.content || "";

    if (!userMessage.trim()) {
      return NextResponse.json({ text: "Please provide a question or message." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    // If Groq API key is not configured, use rich local persona knowledge base
    if (!apiKey) {
      const fallback = findResponse(userMessage);
      return NextResponse.json({ text: fallback, model: "local-persona" });
    }

    // Format chat messages for Groq OpenAI-compatible API
    const formattedMessages = [
      { role: "system", content: AFSAR_SYSTEM_PROMPT },
      ...messages.slice(-8).map((m: { role: string; text?: string; content?: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text || m.content || "",
      })),
    ];

    // Ensure the latest message is in the payload if not already
    if (!formattedMessages.some((m) => m.role === "user" && m.content === userMessage)) {
      formattedMessages.push({ role: "user", content: userMessage });
    }

    let lastError: unknown = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: formattedMessages,
            temperature: 0.72,
            max_tokens: 380,
            top_p: 0.9,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply && reply.trim()) {
            return NextResponse.json({ text: reply.trim(), model });
          }
        } else {
          const errText = await response.text();
          console.warn(`Groq model ${model} failed (${response.status}):`, errText);
          lastError = errText;
        }
      } catch (err) {
        console.warn(`Groq request failed for model ${model}:`, err);
        lastError = err;
      }
    }

    // Fallback to local persona engine if all models fail
    console.error("All Groq model attempts failed. Using local fallback. Last error:", lastError);
    const fallback = findResponse(userMessage);
    return NextResponse.json({ text: fallback, model: "local-fallback" });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      text: "I ran into a temporary issue connecting to my neural network, but I'm here! Feel free to ask about my AI projects, tech stack, or background.",
      model: "local-fallback",
    }, { status: 200 });
  }
}

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  const configuredModel = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
  const hasKey = Boolean(apiKey && apiKey.trim().length > 0);

  if (!hasKey) {
    return NextResponse.json({
      status: "fallback_mode",
      provider: "Local Persona Knowledge Engine",
      activeModel: "local-persona",
      hasApiKey: false,
      message: "GROQ_API_KEY is not set in .env.local. The AI Twin is operating seamlessly on the built-in persona engine.",
    });
  }

  try {
    const testRes = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (testRes.ok) {
      return NextResponse.json({
        status: "online",
        provider: "Groq Cloud",
        activeModel: configuredModel,
        candidateModels: CANDIDATE_MODELS,
        hasApiKey: true,
        message: `Connected to Groq Cloud successfully with primary model ${configuredModel}.`,
      });
    } else {
      const errText = await testRes.text();
      return NextResponse.json({
        status: "error",
        provider: "Groq Cloud",
        hasApiKey: true,
        error: errText,
        message: "API key was provided, but Groq returned an error. Local fallback will handle queries.",
      });
    }
  } catch (err: unknown) {
    return NextResponse.json({
      status: "network_unreachable",
      hasApiKey: true,
      error: String(err),
      message: "Unable to reach api.groq.com. Local fallback will handle queries.",
    });
  }
}

