import { TemplateListType } from "./template";

export interface MarketplaceTemplate extends TemplateListType {
  slug: string;
  is_order: boolean;
  demo_url: string | null;
}

export interface MarketplaceTemplateDetail extends MarketplaceTemplate {
  short_description: string;
  description: string;
  video: string | null;
}
