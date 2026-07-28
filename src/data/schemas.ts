export interface Field {
  id: string;
  label: string;
  placeholder: string;
  /** Optional quick-pick options. Clicking one toggles it into the field's text value. */
  chips?: string[];
}
export interface Section {
  id: string;
  title: string;
  description: string;
  fields: Field[];
  lowSignalPatterns: string[];
  /** "core" = the fast path to a usable profile. "bonus" = optional depth, unlocked after core is done. */
  tier: "core" | "bonus";
}

// Core = the fast path. Answer these 5 and you have a usable, exportable profile in ~2 minutes.
// Bonus = optional depth for people who want a richer profile — never required to export.
export const ROLE_OS_SECTIONS: Section[] = [
  {
    id: "professional-identity",
    title: "Professional Identity",
    description: "Your role and what you specialize in.",
    tier: "core",
    fields: [
      { id: "role", label: "Primary Role", placeholder: "e.g., Senior Full-Stack Engineer & Architect" },
      { id: "specialization", label: "Core Specialization", placeholder: "e.g., Distributed Systems and React Performance" }
    ],
    lowSignalPatterns: ["professional", "hardworking", "expert", "good"]
  },
  {
    id: "target-audience",
    title: "Target Audience",
    description: "Who are you building or communicating for?",
    tier: "core",
    fields: [
      { id: "audience", label: "Primary Audience", placeholder: "e.g., VC-backed startup founders and technical leads" }
    ],
    lowSignalPatterns: ["everyone", "people", "users"]
  },
  {
    id: "voice-tone",
    title: "Voice & Tone",
    description: "How the AI should sound when representing you. Tap what fits, tweak the rest.",
    tier: "core",
    fields: [
      {
        id: "voice", label: "Communication Tone", placeholder: "e.g., Technical, concise, low-ego, data-driven",
        chips: ["Concise", "Technical", "Direct", "Warm", "Data-driven", "Playful", "Formal", "Blunt", "Encouraging", "Analytical"]
      }
    ],
    lowSignalPatterns: ["professional", "nice"]
  },
  {
    id: "core-tools",
    title: "Core Tools",
    description: "Your primary technical stack and hardware.",
    tier: "core",
    fields: [
      {
        id: "tools", label: "Tooling Stack", placeholder: "e.g., Next.js, Rust, AWS, Linear, Neovim",
        chips: ["React", "TypeScript", "Python", "AWS", "Figma", "Notion", "Linear", "VS Code", "Slack", "Excel"]
      }
    ],
    lowSignalPatterns: ["computer", "apps", "software"]
  },
  {
    id: "constraints",
    title: "Constraints",
    description: "Non-negotiable boundaries. Tap what fits, tweak the rest.",
    tier: "core",
    fields: [
      {
        id: "constraints", label: "Hard Limits", placeholder: "e.g., No working on Sundays, No legacy PHP projects",
        chips: ["No jargon", "No fluff", "No emojis", "No filler intros", "Cite sources", "Under 200 words", "No unsolicited advice", "Ask before assuming"]
      }
    ],
    lowSignalPatterns: ["limit"]
  },
  {
    id: "value-proposition",
    title: "Value Proposition",
    description: "The specific 'transformation' you provide to your audience.",
    tier: "bonus",
    fields: [
      { id: "value", label: "Core Value", placeholder: "e.g., Reducing infrastructure costs by 40% through serverless optimization" }
    ],
    lowSignalPatterns: ["quality", "best", "fast", "reliable"]
  },
  {
    id: "standard-workflows",
    title: "Standard Workflows",
    description: "Step-by-step technical procedures you follow.",
    tier: "bonus",
    fields: [
      { id: "workflow", label: "Primary Workflow", placeholder: "e.g., 1. Audit -> 2. Benchmark -> 3. Refactor -> 4. Verify" }
    ],
    lowSignalPatterns: ["workflow", "process", "steps"]
  },
  {
    id: "success-metrics",
    title: "Success Metrics",
    description: "How do you quantify a 'job well done'?",
    tier: "bonus",
    fields: [
      { id: "metrics", label: "Key Metrics", placeholder: "e.g., TTI < 1.2s, 0 P0 bugs in production, 90% test coverage" }
    ],
    lowSignalPatterns: ["happy", "success", "done"]
  },
  {
    id: "collaboration-style",
    title: "Collaboration Style",
    description: "Your protocol for interacting with others. Tap what fits, tweak the rest.",
    tier: "bonus",
    fields: [
      {
        id: "collaboration", label: "Interaction Protocol", placeholder: "e.g., Asynchronous-first, radical candor, RFC-driven decisions",
        chips: ["Async-first", "Direct feedback", "Weekly syncs", "Written RFCs", "Pair programming", "Minimal meetings", "Radical candor"]
      }
    ],
    lowSignalPatterns: ["friendly", "nice", "team player"]
  },
  {
    id: "knowledge-base",
    title: "Knowledge Base",
    description: "The specific domains you have deep mastery in.",
    tier: "bonus",
    fields: [
      { id: "knowledge", label: "Domain Expertise", placeholder: "e.g., FinTech regulations, Web3 security, React internals" }
    ],
    lowSignalPatterns: ["coding", "tech", "everything"]
  },
  {
    id: "philosophical-alignment",
    title: "Philosophical Alignment",
    description: "Your underlying engineering or business principles. Tap what fits, tweak the rest.",
    tier: "bonus",
    fields: [
      {
        id: "philosophy", label: "Core Principles", placeholder: "e.g., Simple > Easy, Premature optimization is the root of all evil",
        chips: ["Simple > easy", "Ship fast, iterate", "Data over opinions", "Done > perfect", "Question assumptions"]
      }
    ],
    lowSignalPatterns: ["values", "beliefs"]
  },
  {
    id: "expertise-credentials",
    title: "Expertise & Credentials",
    description: "Hard evidence of your skills.",
    tier: "bonus",
    fields: [
      { id: "credentials", label: "Key Achievements", placeholder: "e.g., Scaled platform to 1M DAU, AWS Certified Architect" }
    ],
    lowSignalPatterns: ["smart", "skilled", "experienced"]
  },
  {
    id: "unfair-advantage",
    title: "Unfair Advantage",
    description: "What makes you uniquely effective compared to others?",
    tier: "bonus",
    fields: [
      { id: "advantage", label: "Competitive Edge", placeholder: "e.g., Rare intersection of deep design sense and kernel engineering" }
    ],
    lowSignalPatterns: ["unique", "special"]
  },
  {
    id: "decision-rules",
    title: "Decision Rules",
    description: "If-Then logic for your operations.",
    tier: "bonus",
    fields: [
      { id: "rules", label: "Operating Heuristics", placeholder: "e.g., IF cost > $500 AND impact < 5% THEN deprecate" }
    ],
    lowSignalPatterns: ["rules", "choices"]
  },
  {
    id: "output-preferences",
    title: "Output Preferences",
    description: "Formatting and delivery requirements. Tap what fits, tweak the rest.",
    tier: "bonus",
    fields: [
      {
        id: "output", label: "Delivery Format", placeholder: "e.g., Markdown tables, executable CLI snippets, no intro/outro",
        chips: ["Bullet points", "Markdown tables", "Code blocks only", "No intro/outro", "Step-by-step", "Executive summary first"]
      }
    ],
    lowSignalPatterns: ["good", "clean", "output"]
  }
];

export const CORE_SECTIONS = ROLE_OS_SECTIONS.filter(s => s.tier === "core");
export const BONUS_SECTIONS = ROLE_OS_SECTIONS.filter(s => s.tier === "bonus");
