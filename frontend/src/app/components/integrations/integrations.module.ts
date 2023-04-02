import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { IntegrationsRoutingModule } from "./integrations-routing.module";
import { IntegrationListComponent } from "./manage/manage.component";
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from "primeng/table";
@NgModule({
  declarations: [IntegrationListComponent],
  imports: [CommonModule, IntegrationsRoutingModule, SharedModule,
  TableModule
  ],
})
export class IntegrationsModule {}
