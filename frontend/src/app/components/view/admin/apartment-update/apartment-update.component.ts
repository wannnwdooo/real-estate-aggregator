import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IApartment } from '@src/app/interfaces/apartments.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApartmentsService } from '@services/api/apartments.service';
import { ApartmentStateService } from '@services/state/apartment-state.service';
import { ModalService } from '@services/components/modal.service';
import { NotificationService } from '@services/components/notification.service';

interface ApartmentChanges extends SimpleChanges {
  data: {
    previousValue: IApartment;
    currentValue: IApartment;
    firstChange: boolean;
    isFirstChange: () => boolean;
  };
}

interface FormField {
  key: keyof IApartment;
  label: string;
}

@Component({
  selector: 'app-apartment-update',
  templateUrl: './apartment-update.component.html',
})
export class ApartmentUpdateComponent implements OnChanges {
  @Input() data!: IApartment;
  @Output() updateSuccess = new EventEmitter<IApartment>();

  constructor(
    private apartmentsService: ApartmentsService,
    private apartmentStateService: ApartmentStateService,
    private modalService: ModalService,
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

  ngOnChanges(changes: ApartmentChanges) {
    if (changes.data && changes.data.currentValue) {
      this.formGroup.patchValue({
        number: this.data.number,
        rooms: this.data.rooms,
        area: this.data.area,
        floor: this.data.floor,
        price: this.data.price,
      });
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const updatedData = this.formGroup.value;
      this.apartmentsService
        .updateApartment(this.data.id, updatedData)
        .subscribe(
          (response) => {
            console.log('Обновлено: ', response);
            this.updateSuccess.emit(response);
            this.apartmentStateService.updateApartment(response);
            this.notification.success('Объект недвидимости обновлён');
          },
          (error) => {
            console.error('Ошибка обновления: ', error);
            this.notification.error(error.error.message);
          }
        );
    }
  }

  onDelete(): void {
    this.apartmentsService.deleteApartment(this.data.id).subscribe(
      (response) => {
        console.log('Удалено: ', response);
        this.apartmentStateService.deleteApartment(this.data.id);
        this.notification.success('Объект недвидимости удалён');
        this.modalService.toggleModal();
      },
      (error) => {
        console.error('Ошибка удаления: ', error);
        this.notification.error(error.error.message);
      }
    );
  }
}
