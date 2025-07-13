export interface ResponseType<T> {
  status: boolean;
  data: T;
}

export interface PaginationResponse<T> {
  status: boolean;
  data: {
    links: Links;
    total_items: number;
    total_pages: number;
    page_size: number;
    current_page: number;
    results: T;
  };
}

export interface Links {
  previous: string | null;
  next: string | null;
}
