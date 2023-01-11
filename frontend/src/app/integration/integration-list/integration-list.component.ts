import { IntegrationDetailsComponent } from '../integration-details/integration-details.component';
import { Observable } from "rxjs";
import { DBService } from "src/app/db.service";
import { Integration } from "src/app/integration";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
@Component({
  selector: "app-integration-list",
  templateUrl: "./integration-list.component.html",
  styleUrls: ["./integration-list.component.css"]
})
export class IntegrationListComponent implements OnInit {
  integrations: Observable<Integration[]>;

  constructor(private dbService: DBService,
    private router: Router) {}

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.integrations = this.dbService.getObjectList("integrations");
  }

  deleteIntegration(_id: string) {
    this.dbService.deleteObject("integrations",_id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }
  updateIntegration(id: string){
    this.router.navigate(['update', id]);
  }
  integrationDetails(_id: string){
    this.router.navigate(['details', _id]);
  }
}