import { Component, EventEmitter, Output } from '@angular/core';
import { IApartment } from '@src/app/interfaces/apartments.interface';
import { ApartmentStateService } from '@services/state/apartment-state.service';
import { ApartmentsService } from '@services/api/apartments.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@services/components/notification.service';

interface FormField {
  key: keyof IApartment;
  label: string;
}

@Component({
  selector: 'app-apartment-create',
  templateUrl: './apartment-create.component.html',
})
export class ApartmentCreateComponent {
  @Output() createSuccess = new EventEmitter<IApartment>();

  constructor(
    private apartmentsService: ApartmentsService,
    private apartmentStateService: ApartmentStateService,
    private notification: NotificationService
  ) {}

  formGroup: FormGroup = new FormGroup({
    number: new FormControl('', [Validators.required]),
    rooms: new FormControl('', [Validators.required]),
    area: new FormControl('', [Validators.required]),
    floor: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
  });

  formFields: FormField[] = [
    { key: 'number', label: 'Номер' },
    { key: 'rooms', label: 'Комнат' },
    { key: 'area', label: 'Площадь' },
    { key: 'floor', label: 'Этаж' },
    { key: 'price', label: 'Цена' },
  ];

  onSubmit(): void {
    if (this.formGroup.valid) {
      const newData = this.formGroup.value;
      this.apartmentsService.createApartment(newData).subscribe(
        (response) => {
          console.log('Создано: ', response);
          this.createSuccess.emit(response);
          this.apartmentStateService.addApartment(response);
          this.notification.success('Объект недвидимости создан');
        },
        (error) => {
          console.error('Ошибка создания: ', error);
          this.notification.error(error.error.message);
        }
      );
    }
  }
}
