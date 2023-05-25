import { Component, OnDestroy, OnInit } from '@angular/core';
import { loginBanner, registerBanner } from '@src/assets/static/auth/auth';
import { AuthService } from '@src/app/services/api/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '@services/components/notification.service';
import { Subject, takeUntil } from 'rxjs';

interface IAuth {
  email: string;
  password: string;
}
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm = true;
  serverError = '';
  isAuth!: boolean;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isLoggedIn) => {
        this.isAuth = isLoggedIn;
      });
  }

  onLogin(value: IAuth) {
    this.authService
      .login(value.email, value.password)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response) => {
          this.serverError = '';
          this.router.navigate(['/admin']);
          this.notification.success('Вы успешно вошли');
        },
        (error) => {
          this.serverError = 'Ошибка входа';
          this.notification.error(error.error.message);
        }
      );
  }

  onRegistration(value: IAuth) {
    this.authService
      .register(value.email, value.password)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response) => {
          this.serverError = '';
          this.router.navigate(['/']);
          this.notification.success('Вы зарегестрированы, войдите в систему');
        },
        (error) => {
          this.serverError = 'Ошибка регистрации';
          this.notification.error(error.error.message);
        }
      );
  }

  changeAuthMethod() {
    this.loginForm = !this.loginForm;
  }

  protected readonly loginBanner = loginBanner;
  protected readonly registerBanner = registerBanner;

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
