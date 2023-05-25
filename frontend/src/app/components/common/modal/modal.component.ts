import { Component } from '@angular/core';
import { ModalService } from '@services/components/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  constructor(public modalService: ModalService) {}
}
