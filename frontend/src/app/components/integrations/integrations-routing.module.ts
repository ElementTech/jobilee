import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IntegrationListComponent } from "./manage/manage.component";
const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "manage",
        component: IntegrationListComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegrationsRoutingModule {}
