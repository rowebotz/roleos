export function expandThought(input: string): { clearer: string; specific: string; confident: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      clearer: "Add a few words first, and we'll offer rewrites here.",
      specific: "Add a few words first, and we'll offer rewrites here.",
      confident: "Add a few words first, and we'll offer rewrites here."
    };
  }
  // Strip a trailing period so the rewrites read cleanly.
  const core = trimmed.replace(/\.+$/, "");
  return {
    clearer: `${core} — in plain terms, so anyone can follow it.`,
    specific: `${core}, with concrete details: who it's for, what changes, and how you'd know it worked.`,
    confident: `${core}. This is a core strength, and it consistently delivers results.`
  };
}
