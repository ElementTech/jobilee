import { Routes } from "@angular/router";

export const content: Routes = [
  // {
  //   path: "simple-page",
  //   loadChildren: () => import("../../components/examples/simple-page/simple-page.module").then((m) => m.SimplePageModule),
  // },
  // {
  //   path: "single-page",
  //   loadChildren: () => import("../../components/single-page/single-page.module").then((m) => m.SinglePageModule),
  // },
  {
    path: "catalog",
    loadChildren: () => import("../../components/catalog/catalog.module").then((m) => m.CatalogModule),
  },  
  {
    path: "jobs",
    loadChildren: () => import("../../components/jobs/jobs.module").then((m) => m.JobsModule),
  },  
  {
    path: "integrations",
    loadChildren: () => import("../../components/integrations/integrations.module").then((m) => m.IntegrationsModule),
  },    
  {
    path: "charts",
    loadChildren: () => import("../../components/charts/charts.module").then((m) => m.ChartsModule),
  },  
  {
    path: "dashboards",
    loadChildren: () => import("../../components/dashboards/dashboards.module").then((m) => m.DashboardsModule),
  },     
];
