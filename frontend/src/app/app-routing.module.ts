import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";

import { ContentComponent } from "./shared/components/layout/content/content.component";
import { FullComponent } from "./shared/components/layout/full/full.component";
import { full } from "./shared/routes/full.routes";
import { content } from "./shared/routes/routes";


// Custom Components
import { CatalogComponent } from "./components/catalog/catalog.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "catalog",
    pathMatch: "full",
  },
  {
    path: "",
    component: ContentComponent,
    children: content

  },
  {
    path: "",
    component: FullComponent,
    children: full


  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  imports: [
    [
      RouterModule.forRoot(routes, {
        anchorScrolling: "enabled",
        scrollPositionRestoration: "enabled",
      }),
    ],
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
