import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JobHistoryComponent } from "./history/history.component";
import { JobCreateComponent } from "./create/create.component";
import { JobListComponent } from "./manage/manage.component";
import { RunJobComponent } from "./run/run.component";
import { JobResultComponent } from "./result/result.component";
import { JobEditComponent } from "./edit/edit.component";
import { JobResponseComponent } from "./response/response.component";
const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "manage",
        component: JobListComponent,
      },
      {
        path: "run/:_id",
        component: RunJobComponent,
      },
      { path: "history/:_id", component: JobHistoryComponent },
      { path: "create", component: JobCreateComponent },
      { path: "edit/:_id", component: JobEditComponent },
      { path: 'result/:_id/:task', component: JobResultComponent },
      { path: 'response/:_id/:task_id/:step/:attribute', component: JobResponseComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsRoutingModule {}
