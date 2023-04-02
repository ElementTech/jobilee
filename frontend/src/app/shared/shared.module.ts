import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DragulaModule } from "ng2-dragula";
import { TranslateModule } from "@ngx-translate/core";

// Components
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { FeatherIconsComponent } from "./components/feather-icons/feather-icons.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { ContentComponent } from "./components/layout/content/content.component";
import { FullComponent } from "./components/layout/full/full.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { TapToTopComponent } from "./components/tap-to-top/tap-to-top.component";

// Jobilee Shared Components
import { ChartFormComponent } from "./components/jobilee/chart-form/chart-form.component";
import { DashboardFormComponent } from "./components/jobilee/dashboard-form/dashboard-form.component";
import { DashboardViewComponent } from "./components/jobilee/dashboard-view/dashboard-view.component";
import { IntegrationFormComponent } from "./components/jobilee/integration-form/integration-form.component";
import { JobFormComponent, NgbdModalContent } from "./components/jobilee/job-form/job-form.component";
import { ParameterComponent } from "./components/jobilee/parameter/parameter.component";
import { ParameterFormComponent } from "./components/jobilee/parameter-form/parameter-form.component";
import { JobResponseComponent } from "./components/jobilee/job-response/job-response.component";
import { StepFormComponent } from "./components/jobilee/step-form/step-form.component";
import { ManageComponent } from "./components/jobilee/manage/manage.component";

// Jobilee Legacy Modules
import { MenubarModule } from "primeng/menubar";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { CardModule } from "primeng/card";
import { FieldsetModule } from "primeng/fieldset";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectButtonModule } from "primeng/selectbutton";
import { MatStepperModule } from "@angular/material/stepper";
import { ProgressBarModule } from "primeng/progressbar";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MatGridListModule } from "@angular/material/grid-list";
import { QueryBuilderModule } from "angular2-query-builder";
import { EditorModule } from "primeng/editor";
import {
  HighlightModule,
  HIGHLIGHT_OPTIONS,
  HighlightOptions,
} from "ngx-highlightjs";
import { SidebarModule } from "primeng/sidebar";
import { TieredMenuModule } from "primeng/tieredmenu";
import { RippleModule } from "primeng/ripple";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { DropdownModule } from "primeng/dropdown";
import { DividerModule } from "primeng/divider";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { MultiSelectModule } from "primeng/multiselect";
import { DataViewModule } from "primeng/dataview";
import { ToolbarModule } from "primeng/toolbar";
import { PanelModule } from "primeng/panel";
import { CheckboxModule } from "primeng/checkbox";
import { StepsModule } from "primeng/steps";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { MatButtonModule } from "@angular/material/button";
import { TagModule } from "primeng/tag";
import { ChipModule } from "primeng/chip";
import { ToastModule } from "primeng/toast";
import { ListboxModule } from "primeng/listbox";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";
import { TimelineModule } from "primeng/timeline";
import { ChartModule } from "primeng/chart";
import { DragDropModule } from "primeng/dragdrop";
import { TreeSelectModule } from "primeng/treeselect";
import { PaginatorModule } from "primeng/paginator";
import { InputTextareaModule } from "primeng/inputtextarea";
import { AngJsoneditorModule } from '@maaxgr/ang-jsoneditor'
import { ArchwizardModule } from 'angular-archwizard';
// Header Elements Components
import { SearchComponent } from "./components/header/elements/search/search.component";
import { LanguagesComponent } from "./components/header/elements/languages/languages.component";
import { NotificationComponent } from "./components/header/elements/notification/notification.component";
import { BookmarkComponent } from "./components/header/elements/bookmark/bookmark.component";
import { CartComponent } from "./components/header/elements/cart/cart.component";
import { MessageBoxComponent } from "./components/header/elements/message-box/message-box.component";
import { MyAccountComponent } from "./components/header/elements/my-account/my-account.component";

// Services
import { LayoutService } from "./services/layout.service";
import { NavService } from "./services/nav.service";
import { DBService } from "./services/db.service";
import { RunService } from "./services/run.service";
import { DecimalPipe } from "@angular/common";
import { SvgIconComponent } from "./components/svg-icon/svg-icon.component";
import { CarouselModule } from "ngx-owl-carousel-o";
import { SwiperModule } from "swiper/angular";
import { SwiperComponent } from "./components/header/elements/swiper/swiper.component";
import { HttpClientModule } from "@angular/common/http";
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentComponent,
    BreadcrumbComponent,
    FeatherIconsComponent,
    FullComponent,
    LoaderComponent,
    TapToTopComponent,
    SearchComponent,
    LanguagesComponent,
    NotificationComponent,
    BookmarkComponent,
    CartComponent,
    MessageBoxComponent,
    MyAccountComponent,
    SvgIconComponent,
    SwiperComponent,
    ChartFormComponent,
    DashboardFormComponent,
    DashboardViewComponent,
    IntegrationFormComponent,
    NgbdModalContent,
    JobFormComponent,
    JobResponseComponent,
    StepFormComponent,
    ManageComponent,
    ParameterComponent,
    ParameterFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DragulaModule.forRoot(),
    TranslateModule.forRoot(),
    CarouselModule,
    SwiperModule,
    // Legacy Jobilee Modules
    HttpClientModule,
    MenubarModule,
    InputTextModule,
    TabViewModule,
    ArchwizardModule,
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
    EditorModule,
    NgSelectModule
  ],
  providers: [
    NavService,
    LayoutService,
    DBService,
    RunService,
    DecimalPipe,
    NgbActiveModal
  ],
  exports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LoaderComponent,
    BreadcrumbComponent,
    FeatherIconsComponent,
    TapToTopComponent,
    SvgIconComponent,
    SwiperModule,
    ManageComponent,
    JobFormComponent,
    ParameterComponent,
    ParameterFormComponent
  ],
})
export class SharedModule {}
