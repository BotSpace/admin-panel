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
  slug: string | null;
  image: string;
  views: number;
  likes: number;
  price: string;
  original_price: string;
  discount_type: "percent" | "amount";
  discount: string;
  categories: Category[];
  features: Feature[];
  is_order: boolean;
  demo_url: string | null;
}

export interface RetrieveTemplateType extends TemplateListType {
  short_description: string;
  description: string;
  video: string | null;
}
