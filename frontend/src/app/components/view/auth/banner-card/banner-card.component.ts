import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBanner } from '@src/assets/static/auth/auth';

@Component({
  selector: 'app-banner-card',
  templateUrl: './banner-card.component.html',
})
export class BannerCardComponent {
  @Output() changeAuthMethod = new EventEmitter();

  @Input() data!: IBanner;

  onClick() {
    this.changeAuthMethod.emit();
  }
}
