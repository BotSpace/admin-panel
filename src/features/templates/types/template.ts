export interface Category {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
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

export interface TemplateDetailType {
  id: number;
  name: string;
  image: string;
  video: string;
  short_description: string;
  description: string;
  price: number;
  views: number;
  likes: number;
  original_price: string;
  discount: string;
  discount_type: string;
  categories: Category[];
  features: Feature[];
}
