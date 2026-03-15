export interface Category {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
  value?: string;
}

export interface TemplateListType {
  id: number;
  name: string;
  image: string;
  views: number;
  likes: number;
  price: string;
  original_price: string;
  discount_type: "percent" | "fixed";
  discount: string;
  categories: Category[];
  features: Feature[];
}
