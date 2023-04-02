import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardListComponent } from "./manage/manage.component";
const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "manage",
        component: DashboardListComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
