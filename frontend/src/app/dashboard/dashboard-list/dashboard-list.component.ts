import { DashboardDetailsComponent } from '../dashboard-details/dashboard-details.component';
import { Observable } from "rxjs";
import { DBService } from "src/app/db.service";
import { Dashboard } from "src/app/dashboard";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
@Component({
  selector: "app-dashboard-list",
  templateUrl: "./dashboard-list.component.html",
  styleUrls: ["./dashboard-list.component.css"]
})
export class DashboardListComponent implements OnInit {
  dashboards: Observable<Dashboard[]>;
  loading: boolean = true;
  constructor(private dbService: DBService,
    private router: Router) {}
  statuses = [
      {label: 'Unqualified', value: 'unqualified'},
      {label: 'Qualified', value: 'qualified'},
      {label: 'New', value: 'new'},
      {label: 'Negotiation', value: 'negotiation'},
      {label: 'Renewal', value: 'renewal'},
      {label: 'Proposal', value: 'proposal'}
  ]
  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.dashboards = this.dbService.getObjectList("dashboards");
    this.loading = false;
  }

  deleteDashboard(_id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will break jobs that depend on this dashboard.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbService.deleteObject("dashboards",_id)
        .subscribe(
          data => {
            Swal.fire(
              'Deleted!',
              'Dashboard has been deleted.',
              'success'
            )
            this.reloadData();
          },
          error => console.log(error));
      }
    })

  }
  updateDashboard(id: string){
    this.router.navigate(['dashboards/update', id]);
  }
  dashboardDetails(_id: string){
    this.router.navigate(['dashboards/details', _id]);
  }
}