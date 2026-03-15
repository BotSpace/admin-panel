import { Plan } from "@/shared/types/plan";

export const parsePlanPrice = (price: Plan["price"]) => {
  if (typeof price === "number") return price;
  const numeric = parseFloat(price ?? "0");
  return Number.isFinite(numeric) ? numeric : 0;
};

