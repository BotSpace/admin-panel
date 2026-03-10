export function parsePriceToInteger(str: string) {
  if (typeof str !== "string") str = String(str ?? "");
  str = str.trim();
  if (str === "") return NaN;

  const parts = str.split(".");

  if (parts.length > 1 && parts[parts.length - 1].length === 3) {
    return Number(str.replace(/\./g, ""));
  }

  const num = parseFloat(str.replace(/\./g, "."));
  if (Number.isNaN(num)) return NaN;

  return Math.round(num);
}
