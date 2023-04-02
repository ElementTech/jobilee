import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SinglePageRoutingModule } from './single-page-routing.module';
import { SinglePageComponent } from './single-page.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SinglePageComponent
  ],
  imports: [
    CommonModule,
    SinglePageRoutingModule,
    SharedModule
  ]
})
export class SinglePageModule { }
