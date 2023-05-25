export interface IApartment {
  id: string;
  number: number;
  rooms: number;
  area: number;
  floor: number;
  price: number;
}

export interface IApartmentOptions {
  floor: {
    min: number;
    max: number;
  };
  area: {
    min: number;
    max: number;
  };
  price: {
    min: number;
    max: number;
  };
  rooms: number[]
}

export interface IApartmentResponse {
  result: IApartment[];
  minMaxOptions: IApartmentOptions;
  options: IApartmentOptions;
  totalCount: number;
  currentPage: number;
  pages: number;
  order: string;
  orderType: string;
}

export interface IApartmentParams extends IApartmentFilterParams {
  page?: number;
  limit?: number;
  order?: string;
  orderType?: 'ASC' | 'DESC';
}

export interface IApartmentFilterParams {
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  min_floor?: number;
  max_floor?: number;
  rooms?: string;
}
