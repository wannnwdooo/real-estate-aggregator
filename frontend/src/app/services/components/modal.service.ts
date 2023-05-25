import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  visible: boolean = false;

  toggleModal() {
    this.visible = !this.visible;
  }
}
