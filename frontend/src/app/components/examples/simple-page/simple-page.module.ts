import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SimplePageRoutingModule } from "./simple-page-routing.module";
import { FirstPageComponent } from "./first-page/first-page.component";
import { SecondPageComponent } from "./second-page/second-page.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [FirstPageComponent, SecondPageComponent],
  imports: [CommonModule, SimplePageRoutingModule, SharedModule],
})
export class SimplePageModule {}
