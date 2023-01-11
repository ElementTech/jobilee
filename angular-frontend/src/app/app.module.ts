import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateIntegrationComponent } from './create-integration/create-integration.component';
import { IntegrationDetailsComponent } from './integration-details/integration-details.component';
import { IntegrationListComponent } from './integration-list/integration-list.component';
import { UpdateIntegrationComponent } from './update-integration/update-integration.component';
import { HttpClientModule } from '@angular/common/http';
import {MenubarModule} from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
@NgModule({
  declarations: [
    AppComponent,
    CreateIntegrationComponent,
    IntegrationDetailsComponent,
    IntegrationListComponent,
    UpdateIntegrationComponent
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
    CardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
