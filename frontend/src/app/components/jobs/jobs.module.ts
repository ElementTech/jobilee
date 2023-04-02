import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { JobsRoutingModule } from "./jobs-routing.module";
import { JobListComponent } from "./manage/manage.component";
import { JobHistoryComponent } from "./history/history.component";
import { JobResultComponent } from "./result/result.component";
import { RunJobComponent } from "./run/run.component";
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from "primeng/table";
import { ToolbarModule } from "primeng/toolbar";
import { ButtonModule } from "primeng/button";
import { PanelModule } from "primeng/panel";
import { CardModule } from "primeng/card";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from "primeng/dialog";
import { JobCreateComponent } from "./create/create.component";
import { JobEditComponent } from "./edit/edit.component";
import { ParameterComponent } from "src/app/shared/components/jobilee/parameter/parameter.component";
import { TagModule } from "primeng/tag";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { JobResponseComponent } from "./response/response.component";
import { ProgressBarModule } from "primeng/progressbar";
import { AngJsoneditorModule } from "@maaxgr/ang-jsoneditor";
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@NgModule({
  declarations: [JobListComponent,RunJobComponent,JobHistoryComponent,JobCreateComponent,JobEditComponent,JobResultComponent,JobResponseComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, SharedModule, JobsRoutingModule,NgSelectModule,DialogModule,TagModule,PanelModule,ProgressSpinnerModule,
  TableModule,ToolbarModule,ButtonModule,PanelModule,CardModule,ScrollPanelModule, ToolbarModule, ProgressBarModule,AngJsoneditorModule,MonacoEditorModule.forRoot()
  ],
})
export class JobsModule {}
