import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AuthComponent } from './auth.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from '@components/view/auth/login-form/login-form.component';
import { RegistrationFormComponent } from '@components/view/auth/registration-form/registration-form.component';
import { BannerCardComponent } from '@components/view/auth/banner-card/banner-card.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    BannerCardComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent,
      },
    ]),
  ],
  exports: [AuthComponent],
})
export class AuthModule {}
