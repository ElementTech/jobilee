import { IntegrationDetailsComponent } from '../integration-details/integration-details.component';
import { Observable } from "rxjs";
import { DBService } from "src/app/db.service";
import { Integration } from "src/app/integration";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
@Component({
  selector: "app-integration-list",
  templateUrl: "./integration-list.component.html",
  styleUrls: ["./integration-list.component.scss"]
})
export class IntegrationListComponent implements OnInit {
  integrations: Observable<Integration[]>;
  loading: boolean = true;
  constructor(private dbService: DBService,
    private router: Router) {}

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.integrations = this.dbService.getObjectList("integrations");
    this.loading = false;
  }

  getIntegrationIcon(icon,text)
  {
    return icon || `https://www.vectorlogo.zone/logos/${text.split(" ")[0].toLowerCase()}/${text.split(" ")[0].toLowerCase()}-icon.svg`
  }

  deleteIntegration(_id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will break jobs that depend on this integration.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbService.deleteObject("integrations",_id)
        .subscribe(
          data => {
            Swal.fire(
              'Deleted!',
              'Integration has been deleted.',
              'success'
            )
            this.reloadData();
          },
          error => console.log(error));
      }
    })

  }
  updateIntegration(id: string){
    this.router.navigate(['integrations/update', id]);
  }
  integrationDetails(_id: string){
    this.router.navigate(['integrations/details', _id]);
  }
}