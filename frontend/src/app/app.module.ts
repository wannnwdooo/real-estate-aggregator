import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RoutingModule } from '@routing/routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from '@src/app/services/api/auth.service';
import { CredentialsInterceptor } from '@utils/interceptors/credentials.interceptor';
import { HttpUrlInterceptor } from '@utils/interceptors/http-url.interceptor';
import { ButtonModule } from 'primeng/button';
import { MessageService, SharedModule } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from '@components/common/toast/toast.component';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from '@services/components/notification.service';

@NgModule({
  declarations: [AppComponent, ToastComponent],
  imports: [
    BrowserModule,
    RoutingModule,
    HttpClientModule,
    ButtonModule,
    SharedModule,
    BrowserAnimationsModule,
    InputNumberModule,
    PaginatorModule,
    RippleModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpUrlInterceptor,
      multi: true,
    },
    AuthService,
    NotificationService,
    MessageService,
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
