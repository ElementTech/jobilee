import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateIntegrationComponent } from './integration/create-integration/create-integration.component';
import { IntegrationDetailsComponent } from './integration/integration-details/integration-details.component';
import { IntegrationListComponent } from './integration/integration-list/integration-list.component';
import { UpdateIntegrationComponent } from './integration/update-integration/update-integration.component';
import { HttpClientModule } from '@angular/common/http';
import {MenubarModule} from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {FieldsetModule} from 'primeng/fieldset';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SelectButtonModule} from 'primeng/selectbutton';
import { AngJsoneditorModule } from '@maaxgr/ang-jsoneditor'
import {MatStepperModule} from '@angular/material/stepper';
import {ProgressBarModule} from 'primeng/progressbar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MatGridListModule} from '@angular/material/grid-list';
import { QueryBuilderModule } from "angular2-query-builder";
import {EditorModule} from 'primeng/editor';

import {
  HighlightModule,
  HIGHLIGHT_OPTIONS,
  HighlightOptions,
} from 'ngx-highlightjs';
import { CreateJobComponent } from './job/create-job/create-job.component';
import { JobDetailsComponent } from './job/job-details/job-details.component';
import { JobListComponent } from './job/job-list/job-list.component';
import { UpdateJobComponent } from './job/update-job/update-job.component';
import {SidebarModule} from 'primeng/sidebar';
import {TieredMenuModule} from 'primeng/tieredmenu';
import { AppMenuitemComponent } from './app.menuitem.component';
import { RippleModule } from 'primeng/ripple';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {DividerModule} from 'primeng/divider';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {MultiSelectModule} from 'primeng/multiselect';
import { RunJobComponent } from './job/run-job/run-job.component';
import {DataViewModule} from 'primeng/dataview';
import { PlayJobComponent } from './job/play-job/play-job.component';
import {ToolbarModule} from 'primeng/toolbar';
import {PanelModule} from 'primeng/panel';
import {CheckboxModule} from 'primeng/checkbox';
import { JobFormComponent } from './components/job-form/job-form.component';
import { IntegrationFormComponent } from './components/integration-form/integration-form.component';
import {StepsModule} from 'primeng/steps';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import {MatButtonModule} from '@angular/material/button'
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import {ToastModule} from 'primeng/toast';
import {ListboxModule} from 'primeng/listbox';
import {InputNumberModule} from 'primeng/inputnumber';
import { JobResultComponent } from './job/job-result/job-result.component';
import { JobHistoryComponent } from './job/job-history/job-history.component';
import {DialogModule} from 'primeng/dialog';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import {TimelineModule} from 'primeng/timeline';
import { JobResponseComponent } from './components/job-response/job-response.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UpdateChartComponent } from './chart/update-chart/update-chart.component';
import { ChartListComponent } from './chart/chart-list/chart-list.component';
import { ChartDetailsComponent } from './chart/chart-details/chart-details.component';
import { CreateChartComponent } from './chart/create-chart/create-chart.component';
import { ChartFormComponent } from './components/chart-form/chart-form.component';
import {ChartModule} from 'primeng/chart';
import {DragDropModule} from 'primeng/dragdrop';
import {TreeSelectModule} from 'primeng/treeselect';
import { DashboardDetailsComponent } from './dashboard/dashboard-details/dashboard-details.component';
import { DashboardFormComponent } from './components/dashboard-form/dashboard-form.component';
import { DashboardListComponent } from './dashboard/dashboard-list/dashboard-list.component';
import { CreateDashboardComponent } from './dashboard/create-dashboard/create-dashboard.component';
import { UpdateDashboardComponent } from './dashboard/update-dashboard/update-dashboard.component';
import { DashboardViewComponent } from './components/dashboard-view/dashboard-view.component';
import {PaginatorModule} from 'primeng/paginator';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { PlayDashboardComponent } from './dashboard/play-dashboard/play-dashboard.component';
import { StepFormComponent } from './components/step-form/step-form.component';
import { JobOutputComponent } from './job/job-output/job-output.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateIntegrationComponent,
    IntegrationDetailsComponent,
    JobResponseComponent,
    IntegrationListComponent,
    UpdateIntegrationComponent,
    CreateJobComponent,
    JobDetailsComponent,
    JobListComponent,
    UpdateJobComponent,
    AppMenuitemComponent,
    RunJobComponent,
    PlayJobComponent,
    JobFormComponent,
    IntegrationFormComponent,
    BreadcrumbComponent,
    JobResultComponent,
    JobHistoryComponent,
    UpdateChartComponent,
    ChartListComponent,
    ChartDetailsComponent,
    CreateChartComponent,
    ChartFormComponent,
    DashboardDetailsComponent,
    DashboardFormComponent,
    DashboardListComponent,
    CreateDashboardComponent,
    UpdateDashboardComponent,
    DashboardViewComponent,
    PlayDashboardComponent,
    StepFormComponent,
    JobOutputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MenubarModule,
    InputTextModule,
    TabViewModule,
    InputTextareaModule,
    MatGridListModule,
    PaginatorModule,
    ButtonModule,
    TableModule,
    MessagesModule,
    SidebarModule,
    MessageModule,
    CardModule,
    StepsModule,
    KtdGridModule,
    DragDropModule,
    FieldsetModule,
    BreadcrumbModule,
    TreeSelectModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    SelectButtonModule,
    AngJsoneditorModule,
    HighlightModule,
    SidebarModule,
    TieredMenuModule,
    ChartModule,
    RippleModule,
    DropdownModule,
    DividerModule,
    ScrollPanelModule,
    MultiSelectModule,
    DataViewModule,
    ToolbarModule,
    QueryBuilderModule,
    TimelineModule,
    PanelModule,
    CheckboxModule,
    MatStepperModule,
    MatButtonModule,
    TagModule,
    ChipModule,
    DialogModule,
    ListboxModule,
    ToastModule,
    ProgressBarModule,
    InputNumberModule,
    FontAwesomeModule,
    EditorModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: <HighlightOptions>{
        lineNumbers: true,
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
        languages: {
          json: () => import('highlight.js/lib/languages/json')
        },
      },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
