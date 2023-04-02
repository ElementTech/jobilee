import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChartListComponent } from "./manage/manage.component";
const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "manage",
        component: ChartListComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsRoutingModule {}
