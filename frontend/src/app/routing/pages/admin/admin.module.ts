import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TableComponent } from '@components/view/admin/table/table.component';
import { ModalComponent } from '@components/common/modal/modal.component';
import { DialogModule } from 'primeng/dialog';
import { ApartmentUpdateComponent } from '@components/view/admin/apartment-update/apartment-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { ApartmentCreateComponent } from '@components/view/admin/apartment-create/apartment-create.component';
import {PanelModule} from "primeng/panel";

@NgModule({
  declarations: [
    AdminComponent,
    TableComponent,
    ModalComponent,
    ApartmentUpdateComponent,
    ApartmentCreateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
      },
    ]),
    TableModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputNumberModule,
    RippleModule,
    PanelModule,
    NgOptimizedImage,
  ],
})
export class AdminModule {}
