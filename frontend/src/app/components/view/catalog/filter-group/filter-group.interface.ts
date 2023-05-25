export interface FilterParameter {
  name: string;
  minMaxValues: number[];
  rangeValues: number[];
}

export interface SliderEvent {
  values: number[];
}
