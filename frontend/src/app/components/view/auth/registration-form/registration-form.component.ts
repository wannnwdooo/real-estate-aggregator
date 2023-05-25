import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getErrorMsg } from '@utils/helpers/form-error-validation.helper';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
})
export class RegistrationFormComponent {
  formGroup!: FormGroup;

  @Input() formError = '';
  @Output() registration = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onFormChange() {
    this.formError = '';
  }

  onSubmit() {
    this.registration.emit(this.formGroup.value);
  }

  protected readonly getErrorMsg = getErrorMsg;
}
