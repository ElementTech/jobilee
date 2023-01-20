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

@NgModule({
  declarations: [
    AppComponent,
    CreateIntegrationComponent,
    IntegrationDetailsComponent,
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
    JobHistoryComponent
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
    ButtonModule,
    TableModule,
    CardModule,
    StepsModule,
    FieldsetModule,
    BreadcrumbModule,
    RadioButtonModule,
    SelectButtonModule,
    AngJsoneditorModule,
    HighlightModule,
    SidebarModule,
    TieredMenuModule,
    RippleModule,
    DropdownModule,
    DividerModule,
    ScrollPanelModule,
    MultiSelectModule,
    DataViewModule,
    ToolbarModule,
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
    InputNumberModule
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
