import snapshot from "./ontology.ap1-v0.7-subset.json";

export interface OntologyClass {
  id: string;
  label_de: string;
  definition: string;
  granularity: string;
  parent: string | null;
  fallback_to: string | null;
  status: string;
  required_context: string[];
  disjoint_with: string[];
}

/** Fail on corrupt references/cycles rather than silently changing the class space. */
export function validateOntology(classes: OntologyClass[]): void {
  const byId = new Map(classes.map(c => [c.id, c]));
  if (byId.size !== classes.length || !byId.has("PS_UNKNOWN")) throw new Error("Invalid ontology: duplicate IDs or missing PS_UNKNOWN");
  for (const c of classes) {
    if (!/^PS_[A-Z_]+$/.test(c.id) || !c.definition.trim() || !["G0", "G1", "G2", "G3"].includes(c.granularity)) throw new Error(`Invalid class: ${c.id}`);
    if (c.granularity !== "G0" && !c.fallback_to) throw new Error(`Missing fallback: ${c.id}`);
    for (const ref of [c.parent, c.fallback_to, ...c.disjoint_with].filter((v): v is string => v !== null)) {
      if (!byId.has(ref)) throw new Error(`Unknown ontology reference: ${ref}`);
    }
    if (c.fallback_to && byId.get(c.fallback_to)!.granularity >= c.granularity) throw new Error(`Fallback must reduce granularity: ${c.id}`);
    if (c.parent && byId.get(c.parent)!.granularity >= c.granularity) throw new Error(`Parent must reduce granularity: ${c.id}`);
    for (const relation of ["parent", "fallback_to"] as const) {
      const seen = new Set<string>();
      let current: OntologyClass | undefined = c;
      while (current) {
        if (seen.has(current.id)) throw new Error(`Ontology cycle: ${current.id}`);
        seen.add(current.id);
        current = byId.get(current[relation] ?? "");
      }
    }
  }
}

validateOntology(snapshot.classes);
export const ontology = snapshot;
export const classesById = new Map<string, OntologyClass>(ontology.classes.map(c => [c.id, c]));

export function ancestors(id: string): string[] {
  const parent = classesById.get(id)?.parent;
  return parent ? [parent, ...ancestors(parent)] : [];
}

/** Candidate generation prioritizes families but preserves siblings and fallbacks. */
export function generateCandidates(supportedIds: string[]): string[] {
  const ids = new Set(["PS_UNKNOWN"]);
  const known = supportedIds.filter(id => classesById.has(id));
  if (!known.length) return [...classesById.keys()].sort();
  for (const id of known) {
    ids.add(id);
    ancestors(id).forEach(parent => ids.add(parent));
    const c = classesById.get(id)!;
    const family = c.granularity === "G3" ? c.parent! : id;
    for (const other of ontology.classes) {
      if (ancestors(other.id).includes(family)) ids.add(other.id);
    }
  }
  return [...ids].sort();
}
