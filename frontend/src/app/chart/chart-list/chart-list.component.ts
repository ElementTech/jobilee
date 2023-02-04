import { Observable } from "rxjs";
import { DBService } from "src/app/db.service";
import { Chart } from "src/app/chart";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
@Component({
  selector: "app-component-list",
  templateUrl: "./chart-list.component.html",
  styleUrls: ["./chart-list.component.css"]
})
export class ChartListComponent implements OnInit {
  charts: Observable<Chart[]>;
  loading: boolean = true;
  constructor(private dbService: DBService,
    private router: Router) {}

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.charts = this.dbService.getObjectList("charts");
    this.loading = false;
  }

  deleteChart(_id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will break dashboards that depend on this chart.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbService.deleteObject("charts",_id)
        .subscribe(
          data => {
            Swal.fire(
              'Deleted!',
              'Chart has been deleted.',
              'success'
            )
            this.reloadData();
          },
          error => console.log(error));
      }
    })

  }
  updateChart(id: string){
    this.router.navigate(['charts/update', id]);
  }
  chartDetails(_id: string){
    this.router.navigate(['charts/details', _id]);
  }
}