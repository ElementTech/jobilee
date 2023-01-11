import { IntegrationDetailsComponent } from './integration/integration-details/integration-details.component';
import { CreateIntegrationComponent } from './integration/create-integration/create-integration.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IntegrationListComponent } from './integration/integration-list/integration-list.component';
import { UpdateIntegrationComponent } from './integration/update-integration/update-integration.component';

const routes: Routes = [
  { path: '', redirectTo: 'integration', pathMatch: 'full' },
  { path: 'integrations', component: IntegrationListComponent },
  { path: 'add', component: CreateIntegrationComponent },
  { path: 'update/:_id', component: UpdateIntegrationComponent },
  { path: 'details/:_id', component: IntegrationDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }