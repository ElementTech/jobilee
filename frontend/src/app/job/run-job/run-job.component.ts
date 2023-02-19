import { Observable } from "rxjs";
import { DBService } from "src/app/db.service";
import { Job } from "src/app/job";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { SelectItem } from 'primeng/api';
import { Paginator } from "primeng/paginator";
@Component({
  selector: "app-run-job",
  templateUrl: "./run-job.component.html",
  styleUrls: ["./run-job.component.scss"]
})
export class RunJobComponent implements OnInit {
  jobs: any;
  loading: boolean = true;
  sortOrder: number;
  sortField: string;
  sortOptions: SelectItem[];
  jobsPaginated: any;
  constructor(private dbService: DBService,
    private router: Router) {}
  @ViewChild('paginator', { static: true }) paginator: Paginator


  ngOnInit(): void {
    this.reloadData();
    this.sortOptions = [
      {label: 'Integration: A - Z', value: 'integration'},
      {label: 'Integration: Z - A', value: '!integration'},
      {label: 'Name: A - Z', value: 'name'},
      {label: 'Name: Z - A', value: '!name'}
    ];

  }


  reloadData() {
    this.dbService.getJobsCatalog().subscribe(data=>{
      this.jobs = data
      setTimeout(() => {
        this.paginator?.changePage(0);
      });
    });
    this.loading = false;
  }
  editJob(_id: string){
    this.router.navigate(['jobs/update', _id]);
  }
  jobHistory(_id: string){
    this.router.navigate(['jobs/history', _id]);
  }
  runJob(_id: string){
    this.router.navigate(['jobs/run', _id]);
  }
  paginate(event) {
    this.jobsPaginated = this.jobs.slice(event.first, event.first+event.rows);
  }
  
  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
    }
}
}