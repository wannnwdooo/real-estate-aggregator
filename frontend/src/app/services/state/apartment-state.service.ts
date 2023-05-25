import { Injectable } from '@angular/core';
import {
  IApartment,
  IApartmentFilterParams,
  IApartmentOptions,
  IApartmentParams,
} from '@src/app/interfaces/apartments.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApartmentStateService {
  private _apartments = new BehaviorSubject<IApartment[]>([]);
  apartments$ = this._apartments.asObservable();

  private _sort = new BehaviorSubject<{ field: string; order: 'ASC' | 'DESC' }>(
    { field: 'id', order: 'ASC' }
  );
  sort$ = this._sort.asObservable();

  private minMaxOptionsSubject = new BehaviorSubject<IApartmentOptions | null>(
    null
  );
  minMaxOptions$ = this.minMaxOptionsSubject.asObservable();

  private _filter = new BehaviorSubject<IApartmentFilterParams>({});
  filter$ = this._filter.asObservable();

  private dataLoaded = false;
  private firstLoad = true;

  isDataLoaded(): boolean {
    return this.dataLoaded;
  }
  setApartments(apartments: IApartment[]) {
    this._apartments.next(apartments);
    this.dataLoaded = true;
  }

  updateApartment(updatedApartment: IApartment) {
    const apartments = this._apartments.getValue();
    const index = apartments.findIndex(
      (apartment) => apartment.id === updatedApartment.id
    );
    if (index !== -1) {
      apartments[index] = updatedApartment;
      this._apartments.next(apartments);
    }
  }

  addApartment(newApartment: IApartment) {
    const apartments = this._apartments.getValue();
    apartments.push(newApartment);
    this._apartments.next(apartments);
  }

  deleteApartment(deletedApartmentId: string) {
    const apartments = this._apartments.getValue();
    const updatedApartments = apartments.filter(
      (apartment) => apartment.id !== deletedApartmentId
    );
    this._apartments.next(updatedApartments);
  }

  setSort(field: string, order: 'ASC' | 'DESC') {
    this._sort.next({ field, order });
  }

  setMinMaxOptions(options: IApartmentOptions) {
    if (this.firstLoad) {
      this.minMaxOptionsSubject.next(options);
      this.firstLoad = false;
    }
  }

  setFilter(filter: IApartmentParams) {
    this._filter.next(filter);
  }
}
