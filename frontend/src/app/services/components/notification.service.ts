import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  success(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Успех',
      detail: message,
    });
  }

  info(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Информация',
      detail: message,
    });
  }

  warn(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Предупреждение',
      detail: message,
    });
  }

  error(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: message,
    });
  }
}
