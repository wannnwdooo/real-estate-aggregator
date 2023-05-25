import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApartmentsService } from '@services/api/apartments.service';
import { ApartmentStateService } from '@services/state/apartment-state.service';
import { combineLatest, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IApartmentParams,
  IApartmentResponse,
} from '@src/app/interfaces/apartments.interface';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit, OnDestroy {
  totalCount: number = 0;
  currentSort: { field: string; order: 'ASC' | 'DESC' } = {
    field: 'id',
    order: 'ASC',
  };
  sortSubscription: Subscription | undefined;

  constructor(
    private apartmentsService: ApartmentsService,
    private apartmentStateService: ApartmentStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sortSubscription = combineLatest([
      this.apartmentStateService.filter$,
      this.apartmentStateService.sort$,
    ])
      .pipe(
        switchMap(([filter, sort]) => {
          this.currentSort = sort;
          const params: IApartmentParams = {
            page: 1,
            limit: 15,
            ...filter,
            order: sort.field,
            orderType: sort.order,
          };
          return this.apartmentsService.getAllApartment(params);
        })
      )
      .subscribe(this.handleResponse.bind(this));

    this.route.queryParamMap.subscribe((params) => {
      const sortField = params.get('sortField');
      const sortOrder = params.get('sortOrder');
      if (sortField && sortOrder) {
        this.apartmentStateService.setSort(
          sortField,
          sortOrder as 'ASC' | 'DESC'
        );
      }
    });
  }

  handleResponse(response: IApartmentResponse): void {
    const apartmentsWithImages = response.result.map((apartment) => ({
      ...apartment,
      image: `assets/images/flats/flat-${
        Math.floor(Math.random() * 5) + 1
      }.png`,
    }));

    this.totalCount = response.totalCount;
    this.apartmentStateService.setApartments(apartmentsWithImages);
    this.apartmentStateService.setMinMaxOptions(response.minMaxOptions);
  }

  sortApartmentsBy(field: 'price' | 'area') {
    const sortOrder = this.currentSort.order === 'ASC' ? 'DESC' : 'ASC';
    this.apartmentStateService.setSort(field, sortOrder);
    this.currentSort = { field, order: sortOrder };

    const params: IApartmentParams = {
      page: 1,
      limit: 10,
      order: field,
      orderType: sortOrder,
    };

    this.apartmentsService
      .getAllApartment(params)
      .subscribe(this.handleResponse.bind(this));

    this.router.navigate([], {
      queryParams: { sortField: field, sortOrder: sortOrder },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();
    }
  }
}
