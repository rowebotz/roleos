export interface Field {
  id: string;
  label: string;
  placeholder: string;
}
export interface Section {
  id: string;
  title: string;
  description: string;
  fields: Field[];
  lowSignalPatterns: string[];
}
export const ROLE_OS_SECTIONS: Section[] = [
  {
    id: "professional-identity",
    title: "Professional Identity",
    description: "Define your core role, seniority, and unique professional moniker.",
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
    fields: [
      { id: "audience", label: "Primary Audience", placeholder: "e.g., VC-backed startup founders and technical leads" }
    ],
    lowSignalPatterns: ["everyone", "people", "users"]
  },
  {
    id: "value-proposition",
    title: "Value Proposition",
    description: "The specific 'transformation' you provide to your audience.",
    fields: [
      { id: "value", label: "Core Value", placeholder: "e.g., Reducing infrastructure costs by 40% through serverless optimization" }
    ],
    lowSignalPatterns: ["quality", "best", "fast", "reliable"]
  },
  {
    id: "standard-workflows",
    title: "Standard Workflows",
    description: "Step-by-step technical procedures you follow.",
    fields: [
      { id: "workflow", label: "Primary Workflow", placeholder: "e.g., 1. Audit -> 2. Benchmark -> 3. Refactor -> 4. Verify" }
    ],
    lowSignalPatterns: ["workflow", "process", "steps"]
  },
  {
    id: "success-metrics",
    title: "Success Metrics",
    description: "How do you quantify a 'job well done'?",
    fields: [
      { id: "metrics", label: "Key Metrics", placeholder: "e.g., TTI < 1.2s, 0 P0 bugs in production, 90% test coverage" }
    ],
    lowSignalPatterns: ["happy", "success", "done"]
  },
  {
    id: "collaboration-style",
    title: "Collaboration Style",
    description: "Your protocol for interacting with others.",
    fields: [
      { id: "collaboration", label: "Interaction Protocol", placeholder: "e.g., Asynchronous-first, radical candor, RFC-driven decisions" }
    ],
    lowSignalPatterns: ["friendly", "nice", "team player"]
  },
  {
    id: "knowledge-base",
    title: "Knowledge Base",
    description: "The specific domains you have deep mastery in.",
    fields: [
      { id: "knowledge", label: "Domain Expertise", placeholder: "e.g., FinTech regulations, Web3 security, React internals" }
    ],
    lowSignalPatterns: ["coding", "tech", "everything"]
  },
  {
    id: "core-tools",
    title: "Core Tools",
    description: "Your primary technical stack and hardware.",
    fields: [
      { id: "tools", label: "Tooling Stack", placeholder: "e.g., Next.js, Rust, AWS, Linear, Neovim" }
    ],
    lowSignalPatterns: ["computer", "apps", "software"]
  },
  {
    id: "philosophical-alignment",
    title: "Philosophical Alignment",
    description: "Your underlying engineering or business principles.",
    fields: [
      { id: "philosophy", label: "Core Principles", placeholder: "e.g., Simple > Easy, Premature optimization is the root of all evil" }
    ],
    lowSignalPatterns: ["values", "beliefs"]
  },
  {
    id: "expertise-credentials",
    title: "Expertise & Credentials",
    description: "Hard evidence of your skills.",
    fields: [
      { id: "credentials", label: "Key Achievements", placeholder: "e.g., Scaled platform to 1M DAU, AWS Certified Architect" }
    ],
    lowSignalPatterns: ["smart", "skilled", "experienced"]
  },
  {
    id: "unfair-advantage",
    title: "Unfair Advantage",
    description: "What makes you uniquely effective compared to others?",
    fields: [
      { id: "advantage", label: "Competitive Edge", placeholder: "e.g., Rare intersection of deep design sense and kernel engineering" }
    ],
    lowSignalPatterns: ["unique", "special"]
  },
  {
    id: "voice-tone",
    title: "Voice & Tone",
    description: "How the AI should sound when representing you.",
    fields: [
      { id: "voice", label: "Communication Tone", placeholder: "e.g., Technical, concise, low-ego, data-driven" }
    ],
    lowSignalPatterns: ["professional", "nice", "formal"]
  },
  {
    id: "decision-rules",
    title: "Decision Rules",
    description: "If-Then logic for your operations.",
    fields: [
      { id: "rules", label: "Operating Heuristics", placeholder: "e.g., IF cost > $500 AND impact < 5% THEN deprecate" }
    ],
    lowSignalPatterns: ["rules", "choices"]
  },
  {
    id: "constraints",
    title: "Constraints",
    description: "Non-negotiable boundaries.",
    fields: [
      { id: "constraints", label: "Hard Limits", placeholder: "e.g., No working on Sundays, No legacy PHP projects" }
    ],
    lowSignalPatterns: ["no", "limit"]
  },
  {
    id: "output-preferences",
    title: "Output Preferences",
    description: "Formatting and delivery requirements.",
    fields: [
      { id: "output", label: "Delivery Format", placeholder: "e.g., Markdown tables, executable CLI snippets, no intro/outro" }
    ],
    lowSignalPatterns: ["good", "clean", "output"]
  }
];