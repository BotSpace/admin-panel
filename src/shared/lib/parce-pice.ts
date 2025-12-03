/**
 * parsePriceToInteger
 * - Qabul qiladi: "15.000", "123.456.789", "49000.00", "0.0"
 * - Natija: butun son (so'mlarda) — misol: 15000, 123456789, 49000, 0
 */
export function parsePriceToInteger(str: string) {
  if (typeof str !== "string") str = String(str ?? "");
  str = str.trim();
  if (str === "") return NaN;

  const parts = str.split(".");

  // Agar oxirgi qism 3 ta raqamdan iborat bo'lsa — nuqtalar minglik ajratuvchidir
  if (parts.length > 1 && parts[parts.length - 1].length === 3) {
    // barcha nuqtalarni olib tashlaymiz
    return Number(str.replace(/\./g, ""));
  }

  // Aks holda — oxirgi qism 2 ta (yoki boshqa) uzunlikda bo'lsa — o'nlik ajratuvchi deb hisoblaymiz
  // parseFloat ishlatib o'nlik ni olamiz, so'ng so'mga (butun) aylantiramiz.
  const num = parseFloat(str.replace(/\./g, ".")); // bu qatorda replace zarur emas, lekin qolishi xavfsiz
  if (Number.isNaN(num)) return NaN;

  // Agar noyob natija kerak bo'lsa: agar .00 bo'lsa butun so'm, aks holda yaxlitlash yoki floor qilish mumkin.
  // Quyida biz kontekst bo'yicha eng ko'p ishlatiladigan: yaxlitlash (Math.round).
  return Math.round(num);
}
