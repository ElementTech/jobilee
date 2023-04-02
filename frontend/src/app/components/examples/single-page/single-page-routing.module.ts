import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SinglePageComponent } from "./single-page.component";

const routes: Routes = [
  {
    path: "",
    component: SinglePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SinglePageRoutingModule {}
