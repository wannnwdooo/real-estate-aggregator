import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApartmentsService } from '@services/api/apartments.service';
import { ApartmentStateService } from '@services/state/apartment-state.service';
import { Observable, Subscription } from 'rxjs';
import { IApartmentWithImage } from '@components/view/catalog/apartments-list/apartments-list.interface';

@Component({
  selector: 'app-apartments-list',
  templateUrl: './apartments-list.component.html',
  styleUrls: ['./apartments-list.component.scss'],
})
export class ApartmentsListComponent implements OnInit, OnDestroy {
  apartments$: Observable<IApartmentWithImage[]>;
  private sortSubscription?: Subscription;

  constructor(
    private apartmentsService: ApartmentsService,
    private apartmentStateService: ApartmentStateService
  ) {
    this.apartments$ = this.apartmentStateService.apartments$;
  }

  ngOnInit(): void {
    this.apartments$ = this.apartmentStateService.apartments$;
  }

  ngOnDestroy(): void {
    if (this.sortSubscription) {
      this.sortSubscription?.unsubscribe();
    }
  }
}
