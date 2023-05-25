import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getErrorMsg } from '@utils/helpers/form-error-validation.helper';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit {
  formGroup!: FormGroup;

  @Input() formError = '';
  @Output() login = new EventEmitter();

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
    this.login.emit(this.formGroup.value);
  }

  protected readonly getErrorMsg = getErrorMsg;
}
