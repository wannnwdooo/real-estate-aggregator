import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApartmentStateService } from '@services/state/apartment-state.service';
import { IApartmentOptions } from '@src/app/interfaces/apartments.interface';
import { Subscription, tap } from 'rxjs';
import { convertObjectValuesToNumbers } from '@utils/helpers/object-convertor';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  FilterParameter,
  SliderEvent,
} from '@components/view/catalog/filter-group/filter-group.interface';

@Component({
  selector: 'app-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
})
export class FilterGroupComponent implements OnInit, OnDestroy {
  toggleButtonGroup = [
    { name: '1', checked: false },
    { name: '2', checked: false },
    { name: '3', checked: false },
    { name: '4', checked: false },
  ];

  filterParameters: {
    name: 'floor' | 'area' | 'price';
    minMaxValues: number[];
    rangeValues: number[];
    displayName: string;
  }[] = [
    {
      name: 'floor',
      minMaxValues: [0, 0],
      rangeValues: [0, 0],
      displayName: 'Этаж',
    },
    {
      name: 'area',
      minMaxValues: [0, 0],
      rangeValues: [0, 0],
      displayName: 'Площадь, м2',
    },
    {
      name: 'price',
      minMaxValues: [0, 0],
      rangeValues: [0, 0],
      displayName: 'Цена, млн ₽',
    },
  ];

  private routeSub: Subscription | undefined;

  constructor(
    private apartmentStateService: ApartmentStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.apartmentStateService.minMaxOptions$
      .pipe(tap(this.handleMinMaxOptions.bind(this)))
      .subscribe();
  }

  handleFilterParameters(options: IApartmentOptions): void {
    this.filterParameters.forEach((param) => {
      param.minMaxValues = [options[param.name].min, options[param.name].max];
      param.rangeValues = [...param.minMaxValues];
    });
  }

  onSliderChange(event: SliderEvent, param: FilterParameter) {
    param.rangeValues = event.values;
  }

  onSlideEnd(event: SliderEvent, param: FilterParameter) {
    param.rangeValues = event.values;
    this.setFilterAndNavigate();
  }

  onToggleButtonChange(): void {
    this.setFilterAndNavigate();
  }

  resetFilters(): void {
    this.toggleButtonGroup.forEach((button) => {
      button.checked = false;
    });
    this.filterParameters.forEach((param) => {
      param.rangeValues = [...param.minMaxValues];
    });
    this.setFilterAndNavigate();
  }

  setFilterAndNavigate(): void {
    const rooms = this.toggleButtonGroup
      .filter((button) => button.checked)
      .map((button) => button.name)
      .join(',');

    const queryParams = this.filterParameters.reduce(
      (params, param) => ({
        ...params,
        [`min_${param.name}`]: param.rangeValues[0],
        [`max_${param.name}`]: param.rangeValues[1],
      }),
      { rooms }
    );

    this.apartmentStateService.setFilter(queryParams);
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private handleMinMaxOptions(options: IApartmentOptions | null): void {
    if (!options) return;

    options = convertObjectValuesToNumbers<IApartmentOptions>(options);
    this.handleFilterParameters(options);

    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      this.handleRouteParams(params);
      this.setFilterAndNavigate();
    });
  }

  private handleRouteParams(params: ParamMap): void {
    this.filterParameters.forEach((param) => {
      const min = params.get(`min_${param.name}`);
      const max = params.get(`max_${param.name}`);

      param.rangeValues =
        min && max ? [Number(min), Number(max)] : param.rangeValues;
    });

    const rooms = params.get('rooms') || '';
    if (rooms) {
      const roomsArray = rooms.split(',').map(Number);
      this.toggleButtonGroup.forEach((button) => {
        button.checked = roomsArray.includes(Number(button.name));
      });
    }
  }

  convertToMillions(value: number): string {
    return (value / 1_000_000).toFixed(1);
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }
}
