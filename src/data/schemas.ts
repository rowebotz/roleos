export interface Field {
  id: string;
  label: string;
  placeholder: string;
}
export interface Section {
  id: string;
  title: string;
  description: string;
  /** Plain-language note on how an AI uses this section. */
  why: string;
  fields: Field[];
  lowSignalPatterns: string[];
}
export const ROLE_OS_SECTIONS: Section[] = [
  {
    id: "identity",
    title: "Your Role",
    description: "Who you are and what you do.",
    why: "Helps the AI speak to you at the right level and use the language of your field.",
    fields: [
      { id: "role", label: "Role", placeholder: "e.g., Marketing manager, family lawyer, high-school science teacher, freelance designer" },
      { id: "specialization", label: "Focus area", placeholder: "e.g., B2B email campaigns, estate planning, biology curriculum, brand identity" },
      { id: "credentials", label: "Experience & credentials", placeholder: "e.g., 10 years in the field, CFP certified, published author, led a team of 12" }
    ],
    lowSignalPatterns: ["professional", "hardworking", "expert", "good"]
  },
  {
    id: "audience",
    title: "Who You Serve",
    description: "The people you work with, help, or communicate for.",
    why: "Lets the AI tailor tone, vocabulary, and examples to the right people.",
    fields: [
      { id: "audience", label: "Primary audience", placeholder: "e.g., Small-business owners, first-time homebuyers, 9th-grade students, enterprise buyers" }
    ],
    lowSignalPatterns: ["everyone", "people", "users"]
  },
  {
    id: "goals",
    title: "Goals & Outcomes",
    description: "The results you're trying to create and how you measure them.",
    why: "Gives the AI a north star so its help stays focused on what actually matters to you.",
    fields: [
      { id: "value", label: "The value you provide", placeholder: "e.g., Help clients feel confident through their first home purchase" },
      { id: "metrics", label: "How you measure success", placeholder: "e.g., Repeat clients, on-time delivery, students passing the state exam" }
    ],
    lowSignalPatterns: ["quality", "best", "fast", "success", "happy", "done"]
  },
  {
    id: "workflow",
    title: "How You Work",
    description: "Your typical process and how you work with others.",
    why: "Lets the AI follow your real process instead of suggesting generic steps.",
    fields: [
      { id: "workflow", label: "Your typical process", placeholder: "e.g., Discovery call → proposal → draft → review → final delivery" },
      { id: "collaboration", label: "How you work with others", placeholder: "e.g., Async-first, weekly check-ins, clear written briefs, decisions made openly" }
    ],
    lowSignalPatterns: ["workflow", "process", "steps", "friendly", "nice"]
  },
  {
    id: "expertise",
    title: "Expertise & Tools",
    description: "What you know deeply and the tools you use to do it.",
    why: "Keeps the AI from over-explaining what you already know, and grounds suggestions in your real toolkit.",
    fields: [
      { id: "knowledge", label: "Areas of deep knowledge", placeholder: "e.g., Tax law, conversion copywriting, classroom management, supply-chain logistics" },
      { id: "tools", label: "Tools you use", placeholder: "e.g., Figma, Salesforce, Google Workspace, QuickBooks, Notion" }
    ],
    lowSignalPatterns: ["smart", "skilled", "experienced", "everything", "stuff"]
  },
  {
    id: "voice",
    title: "Voice & Tone",
    description: "How you sound, and how the AI should sound for you.",
    why: "Ensures everything the AI drafts reads like you, not a generic assistant.",
    fields: [
      { id: "voice", label: "Communication style", placeholder: "e.g., Warm and plain-spoken, concise, data-driven, lightly humorous" }
    ],
    lowSignalPatterns: ["professional", "nice", "formal"]
  },
  {
    id: "principles",
    title: "Principles & Rules",
    description: "The values and rules of thumb that guide your decisions.",
    why: "Anchors the AI's recommendations to what you believe and how you actually decide.",
    fields: [
      { id: "philosophy", label: "Guiding principles", placeholder: "e.g., Clarity over cleverness, under-promise and over-deliver, the client owns the decision" },
      { id: "rules", label: "Rules of thumb", placeholder: "e.g., If a request is unclear, ask before starting. If it's urgent, lead with the answer." }
    ],
    lowSignalPatterns: ["values", "beliefs", "rules", "choices"]
  },
  {
    id: "boundaries",
    title: "Boundaries & Output",
    description: "Your hard limits and how you want results delivered.",
    why: "Keeps the AI inside your boundaries and delivers work in a format you can use right away.",
    fields: [
      { id: "constraints", label: "Hard limits", placeholder: "e.g., No legal advice outside my state, no work on weekends, never share client names" },
      { id: "output", label: "Preferred output format", placeholder: "e.g., Short bullet points, a draft email, a table — skip the long intros" }
    ],
    lowSignalPatterns: ["no", "limit", "good", "clean", "output"]
  }
];
