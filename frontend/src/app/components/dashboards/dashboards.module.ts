import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DashboardsRoutingModule } from "./dashboards-routing.module";
import { DashboardListComponent } from "./manage/manage.component";
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from "primeng/table";
@NgModule({
  declarations: [DashboardListComponent],
  imports: [CommonModule, DashboardsRoutingModule, SharedModule,
  TableModule
  ],
})
export class DashboardsModule {}
