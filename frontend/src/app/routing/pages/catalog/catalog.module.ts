import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogComponent } from './catalog.component';
import { RouterModule } from '@angular/router';
import { ApartmentsListComponent } from '@components/view/catalog/apartments-list/apartments-list.component';
import { FilterGroupComponent } from '@components/view/catalog/filter-group/filter-group.component';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {ButtonModule} from "primeng/button";

@NgModule({
  declarations: [
    CatalogComponent,
    ApartmentsListComponent,
    FilterGroupComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CatalogComponent,
      },
    ]),
    SliderModule,
    FormsModule,
    ToggleButtonModule,
    ButtonModule,
  ],
})
export class CatalogModule {}
