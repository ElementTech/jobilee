import { JobDetailsComponent } from '../job-details/job-details.component';
import { Observable } from "rxjs";
import { DBService } from "src/app/db.service";
import { Job } from "src/app/job";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
@Component({
  selector: "app-job-list",
  templateUrl: "./job-list.component.html",
  styleUrls: ["./job-list.component.css"]
})
export class JobListComponent implements OnInit {
  jobs: Observable<Job[]>;
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
    this.jobs = this.dbService.getObjectList("jobs");
    this.loading = false;
  }

  deleteJob(_id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will break jobs that depend on this job.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbService.deleteObject("jobs",_id)
        .subscribe(
          data => {
            Swal.fire(
              'Deleted!',
              'Job has been deleted.',
              'success'
            )
            this.reloadData();
          },
          error => console.log(error));
      }
    })

  }
  updateJob(id: string){
    this.router.navigate(['jobs/update', id]);
  }
  jobDetails(_id: string){
    this.router.navigate(['jobs/details', _id]);
  }
}