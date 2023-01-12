import { IntegrationDetailsComponent } from './integration/integration-details/integration-details.component';
import { CreateIntegrationComponent } from './integration/create-integration/create-integration.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IntegrationListComponent } from './integration/integration-list/integration-list.component';
import { UpdateIntegrationComponent } from './integration/update-integration/update-integration.component';

const routes: Routes = [
  { path: '', redirectTo: 'job', pathMatch: 'full' },
  { path: 'integrations', component: IntegrationListComponent },
  { path: 'integrations/add', component: CreateIntegrationComponent },
  { path: 'integrations/update/:_id', component: UpdateIntegrationComponent },
  { path: 'integrations/details/:_id', component: IntegrationDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }