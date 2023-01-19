import { IntegrationDetailsComponent } from './integration/integration-details/integration-details.component';
import { CreateIntegrationComponent } from './integration/create-integration/create-integration.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IntegrationListComponent } from './integration/integration-list/integration-list.component';
import { UpdateIntegrationComponent } from './integration/update-integration/update-integration.component';
import { CreateJobComponent } from './job/create-job/create-job.component';
import { JobDetailsComponent } from './job/job-details/job-details.component';
import { JobListComponent } from './job/job-list/job-list.component';
import { UpdateJobComponent } from './job/update-job/update-job.component';
import { RunJobComponent } from './job/run-job/run-job.component';
import { PlayJobComponent } from './job/play-job/play-job.component';
import { JobResultComponent } from './job/job-result/job-result.component';
import { JobHistoryComponent } from './job/job-history/job-history.component';

const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: RunJobComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/add', component: CreateJobComponent },
  { path: 'jobs/update/:_id', component: UpdateJobComponent },
  { path: 'jobs/details/:_id', component: JobDetailsComponent },
  { path: 'jobs/run/:_id', component: PlayJobComponent },
  { path: 'jobs/history/:_id', component: JobHistoryComponent },
  { path: 'jobs/result/:_id/:task', component: JobResultComponent },
  { path: 'integrations', component: IntegrationListComponent },
  { path: 'integrations/add', component: CreateIntegrationComponent },
  { path: 'integrations/update/:_id', component: UpdateIntegrationComponent },
  { path: 'integrations/details/:_id', component: IntegrationDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }