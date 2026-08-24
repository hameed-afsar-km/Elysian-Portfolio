type ResponseEntry = { text: string };

export const WELCOME_MESSAGE = `Hi, I'm Afsar's AI Twin. Ask me anything.`;

export const DEFAULT_RESPONSE =
  "Nice try! I'm Afsar's AI Twin, not ChatGPT or your homework bot. My GPU cycles are strictly reserved for talking about Afsar's AI projects (afsGPT, Ferrari F1 3D), hackathons, tech stack, and hiring opportunities. What would you like to know about my work?";

export const SUGGESTED_PROMPTS = [
  "Tell me about yourself",
  "How do you build AI products?",
  "What technologies do you use?",
  "Show me your best projects",
  "Education & College",
  "Hackathons & Milestones",
  "Are you open to internships or hire?",
  "What is afsGPT?",
];

const RESPONSES: Record<string, ResponseEntry> = {

  "greetings": {
    text: `Hey there! 👋 Welcome to my digital twin terminal!

I'm Afsar's AI Twin — 3rd-year CSE builder at Crescent Chennai, President of CTC, and a certified coffee-to-code converter.

Ask me anything:
• My projects (**afsGPT**, **Ferrari F1 3D**, **TRIPZ-AI**, **GitSubway**)
• College life & education (CSE @ Crescent, CGPA 8.49)
• Hackathon battle stories (HH Goa voice RAG, Kerala Police hackathon)
• Open opportunities (Internships, freelance web dev & video editing)

What do you want to grill me on?`,
  },

  "tell me about yourself": {
    text: `I'm Afsar — a 3rd-year B.Tech CSE student at Crescent Institute, Chennai (CGPA 8.49, the other 1.51 is invested in GPU compute).

I consider myself a **hands-on builder who ships real software** rather than just hoarding tutorial certificates. Started 3+ years ago editing videos in After Effects, fell in love with web interaction, scaled into full-stack (Next.js, FastAPI, Supabase), and now I build autonomous multi-agent AI systems and startups.

I also lead **Crescent Technocrats Club (CTC)** as President, turning students from theory enthusiasts into product-shipping builders.`,
  },

  "education & college": {
    text: `Here's my academic blueprint:

• **Degree:** B.Tech in Computer Science and Engineering (CSE)
• **College:** B.S. Abdur Rahman Crescent Institute of Science and Technology, Chennai
• **Year & Batch:** 3rd Year (Class of 2028)
• **CGPA:** **8.49 / 10.0** (tested and verified)
• **Role:** President of Crescent Technocrats Club (CTC)

Balancing college exams with shipping production apps and surviving 24-hour hackathons is my primary cardio.`,
  },

  "hackathons & milestones": {
    text: `I run on hackathons, tight deadlines, and free caffeine. Highlights:

• **HH Goa 2026:** Built a real-time voice RAG system with MSMARCO-XI dataset, vector search, and latency benchmarking.
• **HAC’KP (Kerala Police Hackathon):** Designed an AI crime investigation intelligence tool.
• **Google Big Code Qualifier & Gemini Live Agent:** Multi-agent autonomous workflow challenges.
• **Competitions:** IBM BOB 2.0, Adobe University Hackathon, RevenueCat Shipathon, and NATIVE.LY AI Factory.

Plus, running **CTC** as President lets me mentor peers and build interdisciplinary hackathon teams.`,
  },

  "are you open to internships or hire?": {
    text: `**100% yes!** You can hire me before my calendar gets hijacked by another hackathon.

**What I'm Open To:**
• AI/ML & Software Engineering Internships
• AI Engineer / Full-Stack Engineer roles
• Freelance Web Development & AI Automation
• Video editing & visual design freelance contracts (3+ years experience)
• Early-stage startup collaborations & Co-founder chats

**Location Preferences:**
Remote (India/Global) or Hybrid/On-site in **Chennai** or **Bengaluru**.

**Drop me a line:** [hameedafsar2006@gmail.com](mailto:hameedafsar2006@gmail.com) | [LinkedIn](https://linkedin.com/in/hameedafsar-km)`,
  },

  "contact": {
    text: `Ready to connect? Find me here:

• **Email:** [hameedafsar2006@gmail.com](mailto:hameedafsar2006@gmail.com)
• **LinkedIn:** [linkedin.com/in/hameedafsar-km](https://linkedin.com/in/hameedafsar-km)
• **GitHub:** [github.com/hameed-afsar-km](https://github.com/hameed-afsar-km)
• **Resume:** Grab the verified PDF from the Credentials section above (/Hameed_Afsar_Resume.pdf)!`,
  },

  "how do you build ai products": {
    text: `My recipe for building AI products:

1. **Step 1 — Reality Check:** Ask *"Does this actually need an LLM, or is an if-else statement enough?"*
2. **Step 2 — Architecture:** Build with LangGraph multi-agent orchestration, structured JSON outputs, and vector RAG.
3. **Step 3 — Cost Optimization:** Proactively leverage blazing-fast open-source models (like Groq's openai/gpt-oss-20b) so nobody gets a surprise $5,000 cloud bill.
4. **Step 4 — Polish:** Wrap it in a snappy Next.js + Three.js UI that feels futuristic and butter-smooth.`,
  },

  "what technologies do you use": {
    text: `My battle-tested stack:

• **AI & Agents:** LangGraph, LangChain, RAG, Groq (openai/gpt-oss-20b, Llama), Ollama, OpenAI APIs, FastAPI
• **Frontend & 3D:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Three.js/WebGL
• **Backend & DB:** Python, Node.js, Express, Supabase, PostgreSQL, Firebase
• **Creative Weapons (3+ yrs):** Premiere Pro, After Effects, Figma, Blender

I pick tools based on speed and real-world usefulness, not whatever is trending on Twitter this week.`,
  },

  "show me your best projects": {
    text: `Here's my trophy shelf:

• **afsGPT:** Multi-model AI assistant with RAG, voice AI & web research ([live demo](https://afs-gpt.vercel.app)).
• **Ferrari F1 Experience:** Cinematic 3D WebGL showcase with telemetry & engine sound ([live demo](https://f1-demo-jet.vercel.app)).
• **TRIPZ-AI:** Multi-agent trip planner because organizing vacations manually is painful.
• **GitSubway 3D:** Turns GitHub commit histories into an interactive 3D railway universe ([live demo](https://git-subway.vercel.app)).
• **MIAKSAAA:** Scalable e-commerce store with Supabase & Next.js.
• **PathFindr.ai:** AI career mentorship roadmaps for students.`,
  },

  "what's your design philosophy": {
    text: `Design isn't just sprinkles on a cake — it's product communication.

My rules:
• **Make it fast** (nobody likes a loading spinner).
• **Make it intentional** (every animation guides the eyes).
• **Make it look expensive** (dark mode, glassmorphism, crisp typography).

If a user needs a 10-page user manual to use the app, the UI has failed.`,
  },

  "what are you currently building": {
    text: `Right now, I'm:
1. Scaling **afsGPT** with multi-agent tool execution and speech systems.
2. Building new autonomous agent workflows in LangGraph.
3. Growing **CTC** into a college product incubator.
4. Experimenting with new hackathon ideas so I don't accidentally get 8 hours of sleep.`,
  },

  "career journey": {
    text: `My evolution in 5 stages:

• **Stage 1 (Visual Design):** 3+ years slicing keyframes in Premiere and After Effects.
• **Stage 2 (Frontend):** Discovered code, fell in love with interactive UI in React.
• **Stage 3 (Full-Stack):** Added databases, Supabase, Node.js, and API plumbing.
• **Stage 4 (AI Engineering):** Built production RAG systems and vector search pipelines.
• **Stage 5 (Agentic AI & Startups):** Multi-agent orchestration, autonomous workflows, and product incubation.`,
  },

  "why startups": {
    text: `Because startups let me mash all my obsessions together:
**Engineering + AI + Visual Design + Problem Solving.**

I'd rather spend months building a product that impacts thousands of people than write code that sits unread in an archived branch.`,
  },

  "what is afsgpt": {
    text: `**afsGPT** is my flagship AI assistant platform.

It's a full ecosystem featuring:
• Multi-model provider switching (OpenAI, Groq, Ollama)
• RAG knowledge search & document retrieval
• Real-time Voice AI & Text-to-Speech (TTS)
• Autonomous web research tools

Check it out live: [afs-gpt.vercel.app](https://afs-gpt.vercel.app)!`,
  },

  "what is gitsubway": {
    text: `**GitSubway** turns boring GitHub profiles into a 3D railway galaxy!

Every repo becomes a subway station, and every commit is part of your train line. It gamifies your coding history with 3D visuals, analytics, and station exploration.

Check it out: [git-subway.vercel.app](https://git-subway.vercel.app)!`,
  },

  "what is pathfindr": {
    text: `**PathFindr.ai** is an AI career GPS for students.

Instead of doomscrolling generic career advice, it analyzes your skills and generates personalized learning roadmaps and mentorship.`,
  },

  "explain rag in simple terms": {
    text: `Think of an open-book exam vs. a closed-book exam.

Without notes, an AI answers purely from memory (often confidently hallucinating).
With notes, it first flips to the right chapter, reads the exact facts, and answers correctly.

**RAG (Retrieval-Augmented Generation)** is just giving the AI open-book access to your private data.`,
  },

};

/* ─── Keyword → response key mappings for semantic matching ─── */
const KEYWORD_MAP: Record<string, string[]> = {
  "greetings": [
    "hi", "hello", "hey", "greetings", "sup", "yo", "whats up", "howdy",
    "good morning", "good afternoon", "good evening", "welcome", "hola", "namaste",
  ],
  "education & college": [
    "education", "college", "university", "degree", "btech", "cse", "crescent",
    "cgpa", "marks", "grade", "school", "study", "studying", "graduating", "batch",
  ],
  "hackathons & milestones": [
    "hackathon", "hackathons", "competition", "competitions", "goa", "hh goa",
    "kerala police", "hackp", "big code", "gemini", "sih", "smart india", "award", "achievement",
  ],
  "are you open to internships or hire?": [
    "hire", "internship", "intern", "job", "work", "available", "availability",
    "freelance", "contract", "remote", "chennai", "bengaluru", "collaborate", "co-founder", "co founder",
  ],
  "contact": [
    "contact", "email", "reach", "message", "touch", "talk", "connect",
    "linkedin", "github", "social", "mail", "phone", "resume",
  ],
  "tell me about yourself": [
    "who are you", "name", "about", "yourself", "background", "introduce", "introduction",
    "who is afsar", "who is hameed", "who are u", "bio",
  ],
  "how do you build ai products": [
    "build", "create", "develop", "ai product", "approach", "process", "workflow",
    "how do you", "methodology", "architecture", "practical",
  ],
  "what technologies do you use": [
    "tech", "technologies", "stack", "tools", "framework", "language", "programming",
    "react", "nextjs", "typescript", "tailwind", "python", "skills", "skill", "fastapi", "supabase",
  ],
  "show me your best projects": [
    "project", "projects", "portfolio", "work", "built", "showcase", "examples",
    "best", "favorite", "f1", "ferrari", "miaksaaa", "tripz",
  ],
  "what's your design philosophy": [
    "design", "philosophy", "ui", "ux", "aesthetic", "visual", "interface",
    "style", "theme", "creative", "video editing",
  ],
  "what are you currently building": [
    "currently", "now", "building", "working on", "present", "latest", "recent",
    "current", "active",
  ],
  "career journey": [
    "career", "journey", "experience", "history", "path", "timeline", "evolution",
    "started", "began",
  ],
  "why startups": [
    "startup", "startups", "entrepreneur", "business", "company", "venture",
    "founder", "why startup",
  ],
  "what is afsgpt": [
    "afsgpt", "afs", "assistant", "ai twin", "voice ai",
  ],
  "what is gitsubway": [
    "gitsubway", "subway", "git", "railway", "3d", "github profile",
  ],
  "what is pathfindr": [
    "pathfindr", "pathfinder", "career guidance", "learning roadmap",
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

  // Direct check for simple greetings
  const words = normalized.split(/\s+/);
  const GREETING_WORDS = ["hi", "hello", "hey", "sup", "yo", "howdy", "hola", "namaste"];
  if (words.length <= 2 && words.some(w => GREETING_WORDS.includes(w))) {
    return RESPONSES["greetings"].text;
  }

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

  if (bestScore > 0 && RESPONSES[bestKey]) return RESPONSES[bestKey].text;

  return DEFAULT_RESPONSE;
}
