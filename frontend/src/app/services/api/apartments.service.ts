import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IApartment,
  IApartmentParams,
  IApartmentResponse,
} from '@src/app/interfaces/apartments.interface';
import { prepareHttpParams } from '@utils/helpers/http-params';

@Injectable({
  providedIn: 'root',
})
export class ApartmentsService {
  constructor(private http: HttpClient) {}

  getAllApartment(params: IApartmentParams): Observable<IApartmentResponse> {
    const httpParams = prepareHttpParams(params);

    return this.http.get<IApartmentResponse>(`/apartments`, {
      params: httpParams,
    });
  }

  createApartment(apart: IApartment): Observable<IApartment> {
    return this.http.post<IApartment>(`/apartments`, apart);
  }

  updateApartment(id: string, updateData: IApartment): Observable<IApartment> {
    return this.http.patch<IApartment>(`/apartments/${id}`, updateData);
  }

  deleteApartment(id: string): Observable<void> {
    console.log(id);
    return this.http.delete<void>(`/apartments/${id}`);
  }
}
