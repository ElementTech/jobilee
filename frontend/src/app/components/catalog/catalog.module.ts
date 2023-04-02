import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent, OrderByPipe } from './catalog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [
    CatalogComponent,
    OrderByPipe
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    SharedModule,
    PerfectScrollbarModule
  ]
})
export class CatalogModule { }
