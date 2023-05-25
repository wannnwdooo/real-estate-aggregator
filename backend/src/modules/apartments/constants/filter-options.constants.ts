import { FilterOptions } from '../types/filter-options.type';

export const FilterOptionsConstants: Record<keyof FilterOptions, string> = {
  min_price: 'price',
  max_price: 'price',
  min_area: 'area',
  max_area: 'area',
  min_floor: 'floor',
  max_floor: 'floor',
  rooms: 'rooms',
};
