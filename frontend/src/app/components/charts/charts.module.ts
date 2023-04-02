import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChartsRoutingModule } from "./charts-routing.module";
import { ChartListComponent } from "./manage/manage.component";
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from "primeng/table";
@NgModule({
  declarations: [ChartListComponent],
  imports: [CommonModule, ChartsRoutingModule, SharedModule,
  TableModule
  ],
})
export class ChartsModule {}
