import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  IApartment,
  IApartmentParams,
} from '@src/app/interfaces/apartments.interface';
import { LazyLoadEvent } from 'primeng/api';
import { finalize, Subscription, tap } from 'rxjs';
import { ApartmentsService } from '@services/api/apartments.service';
import { ApartmentStateService } from '@services/state/apartment-state.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit, OnDestroy {
  @Output() apartmentSelected = new EventEmitter<IApartment>();
  @Output() addButtonClick = new EventEmitter<void>();

  public apartments!: IApartment[];
  public totalCount!: number;
  public loading: boolean = false;
  private apartmentStateSubscription: Subscription | undefined;

  constructor(
    private apartmentsService: ApartmentsService,
    private apartmentStateService: ApartmentStateService
  ) {}

  ngOnInit() {
    this.loadData(1, 10);
    this.apartmentStateSubscription =
      this.apartmentStateService.apartments$.subscribe((apartments) => {
        this.apartments = apartments;
      });
  }

  loadApartments(event: LazyLoadEvent) {
    const page =
      event.first === 0 ? 1 : (event.first ?? 10) / (event.rows ?? 10) + 1;
    const limit = event.rows ?? 10;
    this.loadData(page, limit);
  }

  public loadData(page: number, limit: number) {
    this.loading = true;
    const params: IApartmentParams = {
      page: page,
      limit: limit,
    };
    this.apartmentsService
      .getAllApartment(params)
      .pipe(
        tap((response) => {
          this.apartments = response.result;
          this.totalCount = response.totalCount;
          this.apartmentStateService.setApartments(this.apartments);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();
  }

  onClick(apartment: IApartment) {
    this.apartmentSelected.emit(apartment);
  }

  onAddButtonClick(): void {
    this.addButtonClick.emit();
  }

  ngOnDestroy() {
    this.apartmentStateSubscription?.unsubscribe();
  }
}
