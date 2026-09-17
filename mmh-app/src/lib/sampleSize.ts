export function calculateSampleSize(
  p: number,
  confidence: "90" | "95" | "98" | "99",
  validN: number
): { nRequired: number; nRemaining: number } {
  const zMap: Record<string, number> = {
    "90": 1.645,
    "95": 1.96,
    "98": 2.326,
    "99": 2.576,
  };
  const z = zMap[confidence];
  const r = 0.05;
  const M = r * p;
  const nRequired = Math.ceil((z * z * p * (1 - p)) / (M * M));
  const nRemaining = Math.max(0, nRequired - validN);
  return { nRequired, nRemaining };
}
