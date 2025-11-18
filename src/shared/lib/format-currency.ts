export function formatCurrency(amount: number, currency: string = "UZS") {
  // Raqamni formatlaymiz, lekin currency style ishlatmaymiz
  const formattedNumber = new Intl.NumberFormat("uz-UZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${formattedNumber} ${currency}`; // UZSni oxiriga qo‘shamiz
}
