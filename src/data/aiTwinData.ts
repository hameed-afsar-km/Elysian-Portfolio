type ResponseEntry = { text: string };

export const WELCOME_MESSAGE = `Hi, I'm Afsar's AI Twin. Ask me anything.`;

export const DEFAULT_RESPONSE =
  "That's an interesting one. I don't have a specific answer prepared for that, but I can tell you about my projects, my journey in AI and full stack development, the technologies I use, my startup ideas, or my design philosophy. What would you like to know?";

export const SUGGESTED_PROMPTS = [
  "Tell me about yourself",
  "How do you build AI products?",
  "What technologies do you use?",
  "Show me your best projects",
  "What's your design philosophy?",
  "What is afsGPT?",
  "Explain RAG in simple terms",
  "What are you currently building?",
  "Career journey",
  "Why startups?",
  "What is GitSubway?",
  "What is PathFindr?",
];

const RESPONSES: Record<string, ResponseEntry> = {

  "tell me about yourself": {
    text: `I'm Afsar — an AI Engineer, Full Stack Developer, and builder from India.

My journey didn't start with programming. It started with design. I spent years learning Photoshop, creating graphics, editing videos in After Effects, and understanding how visual experiences influence people.

That eventually pulled me into frontend development, then full stack applications, and today into AI systems, RAG architectures, autonomous agents, and intelligent products.

I'm obsessed with building things that feel futuristic but solve real problems. My long-term goal is to build impactful AI startups and products used by millions.`,
  },

  "how do you build ai products": {
    text: `I approach AI products as product systems, not chatbot demos.

First, I identify the workflow that needs intelligence. Then I design the architecture around the user experience.

Depending on the problem, I use RAG, multi-agent orchestration, structured outputs, tool calling, vector search, memory systems, and workflow automation.

I care just as much about UX and reliability as I do about the model itself. A powerful AI that confuses users isn't a successful product.`,
  },

  "what technologies do you use": {
    text: `My core stack today includes:

Frontend:
• React
• Next.js
• TypeScript
• Tailwind CSS
• Framer Motion

Backend:
• Node.js
• Express
• Supabase
• PostgreSQL

AI:
• LangChain
• LangGraph
• RAG
• Multi-Agent Systems
• OpenAI APIs
• Ollama

Other:
• Python
• Git
• GitHub
• Vercel
• Figma

I focus on choosing the right technology for the problem instead of chasing trends.`,
  },

  "show me your best projects": {
    text: `Some of my favorite projects are:

• afsGPT — A multi-model AI assistant platform supporting intelligent workflows and multi-provider LLMs.

• Ferrari F1 Experience — A cinematic interactive 3D web experience with 3D model visualization, audio, and custom physics.

• Crescent Technocrats Club (CTC) — The official flagship club platform with interactive OS mockups and event registration.

• Miaksaaa Ecommerce — A modern full-stack scalable shopping platform with complete checkout and product management.

• GitSubway 3D World — A 3D WebGL universe where GitHub repositories become railway stations.

• DefinitelySafe™, Crave, and CityStat — Other featured projects spanning scrollytelling, queue-free food ordering, and 3D geospatial intelligence.

Each project represents a different stage of my evolution across AI, 3D WebGL, and Full-Stack Engineering.`,
  },

  "what's your design philosophy": {
    text: `My design philosophy comes from my creative background.

I don't see design as decoration. I see it as product communication.

I believe great products should:
• Feel fast
• Feel intentional
• Feel premium
• Feel memorable

Animations should guide attention, not distract from it.

The best interfaces are the ones users understand without needing instructions.`,
  },

  "what are you currently building": {
    text: `Right now I'm focused on AI-powered products and startup ideas.

Some areas I'm actively exploring include:
• Advanced RAG systems
• Multi-agent architectures
• AI workflow automation
• Autonomous browser agents
• Personalized AI assistants
• Education technology platforms

PathFindr and afsGPT are two projects I'm especially excited about because they combine product thinking with AI engineering.`,
  },

  "career journey": {
    text: `My career journey can be divided into five phases.

Phase 1 — Design
I learned Photoshop, visual design, and video editing through After Effects.

Phase 2 — Frontend
I started building websites and became fascinated by creating interactive user experiences.

Phase 3 — Full Stack
I moved into backend systems, databases, APIs, authentication, and deployment.

Phase 4 — AI Engineering
I started building RAG systems, intelligent assistants, and AI-powered applications.

Phase 5 — Agentic AI
Today I'm focused on multi-agent systems, autonomous workflows, and building startup-scale AI products.

Every phase built on the previous one rather than replacing it.`,
  },

  "why startups": {
    text: `Because startups allow me to combine everything I enjoy.

I love solving problems.
I love building products.
I love technology.
I love design.

Startups sit at the intersection of all four.

My goal isn't just to write code. It's to build products that create real impact and potentially become companies of their own.`,
  },

  "what is afsgpt": {
    text: `afsGPT is one of my flagship AI projects.

It's a multi-model AI platform designed to act as an intelligent assistant while supporting future integrations such as speech systems, personalized memory, automation workflows, and AI agents.

The vision is to create an ecosystem rather than a single chatbot.`,
  },

  "what is gitsubway": {
    text: `GitSubway reimagines GitHub profiles as a living 3D railway world.

Every repository becomes a station.
Every contribution becomes part of a journey.

Instead of looking at repositories as boring lists, developers can explore their coding history visually while gaining insights, analytics, and competitive elements.

It's one of the most creative projects I've worked on because it combines development, gamification, visualization, and storytelling.`,
  },

  "what is pathfindr": {
    text: `PathFindr is my vision for the future of career and education guidance.

Students often feel lost when choosing careers, degrees, skills, and learning paths.

PathFindr aims to solve that through AI-powered recommendations, personalized roadmaps, intelligent mentorship, and data-driven guidance.

More than a project, I see it as a potential startup capable of helping students make better decisions about their future.`,
  },

  "explain rag in simple terms": {
    text: `Imagine asking a student a question.

Without notes, they answer from memory.

With notes, they first look up the relevant information and then answer.

RAG works the same way.

Instead of relying only on what the AI learned during training, it first searches your knowledge base, retrieves useful information, and then generates a response.

That's why RAG systems are more accurate and useful for real-world applications.`,
  },

};

/* ─── Keyword → response key mappings for semantic matching ─── */
const KEYWORD_MAP: Record<string, string[]> = {
  "tell me about yourself": [
    "who", "name", "about", "yourself", "background", "introduce", "introduction",
    "hi", "hello", "hey", "greetings", "sup", "yo", "whats up",
  ],
  "how do you build ai products": [
    "build", "create", "develop", "ai product", "approach", "process", "workflow",
    "how do you", "methodology",
  ],
  "what technologies do you use": [
    "tech", "technologies", "stack", "tools", "framework", "language", "programming",
    "react", "nextjs", "typescript", "tailwind", "python", "skills", "skill",
  ],
  "show me your best projects": [
    "project", "projects", "portfolio", "work", "built", "showcase", "examples",
    "best", "favorite", "achievement", "accomplishment",
  ],
  "what's your design philosophy": [
    "design", "philosophy", "ui", "ux", "aesthetic", "visual", "interface",
    "style", "theme", "creative",
  ],
  "what are you currently building": [
    "currently", "now", "building", "working on", "present", "latest", "recent",
    "current", "active",
  ],
  "career journey": [
    "career", "journey", "experience", "history", "path", "timeline", "evolution",
    "started", "began", "background",
  ],
  "why startups": [
    "startup", "startups", "entrepreneur", "business", "company", "venture",
    "founder", "why startup",
  ],
  "what is afsgpt": [
    "afsgpt", "afs", "assistant", "ai twin",
  ],
  "what is gitsubway": [
    "gitsubway", "subway", "git", "railway", "3d", "github profile",
  ],
  "what is pathfindr": [
    "pathfindr", "pathfinder", "education", "career guidance", "learning",
    "student", "mentorship",
  ],
  "explain rag in simple terms": [
    "rag", "retrieval", "knowledge base", "search", "vector", "embedding",
    "context", "retrieve",
  ],
};

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

export function findResponse(input: string): string {
  const normalized = normalize(input);
  if (!normalized) return DEFAULT_RESPONSE;

  const keys = Object.keys(RESPONSES);
  let bestKey = "";
  let bestScore = 0;

  for (const key of keys) {
    const nKey = normalize(key);
    let score = 0;

    if (nKey === normalized) {
      score = 100;
    } else if (nKey.includes(normalized) || normalized.includes(nKey)) {
      score = 50;
    } else {
      const inputWords = normalized.split(/\s+/);
      const keyWords = nKey.split(/\s+/);
      const matches = inputWords.filter(w => keyWords.includes(w)).length;
      score = matches / Math.max(inputWords.length, keyWords.length);
    }

    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  /* ─── Keyword enrichment pass ─── */
  if (bestScore <= 0.5) {
    let kwScore = 0;
    let kwKey = "";
    for (const key of keys) {
      const keywords = KEYWORD_MAP[key] ?? [];
      const inputWords = normalized.split(/\s+/);
      let matchCount = 0;
      for (const kw of keywords) {
        const nKw = normalize(kw);
        if (normalized.includes(nKw) || inputWords.some(w => nKw.includes(w) || w.includes(nKw))) {
          matchCount++;
        }
      }
      if (matchCount > kwScore) {
        kwScore = matchCount;
        kwKey = key;
      }
    }
    if (kwScore > 0 && kwScore >= bestScore) {
      bestScore = kwScore;
      bestKey = kwKey;
    }
  }

  if (bestScore > 0) return RESPONSES[bestKey].text;

  return DEFAULT_RESPONSE;
}
