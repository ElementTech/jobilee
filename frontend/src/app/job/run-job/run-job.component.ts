import { Observable } from "rxjs";
import { DBService } from "src/app/db.service";
import { Job } from "src/app/job";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { SelectItem } from 'primeng/api';
@Component({
  selector: "app-run-job",
  templateUrl: "./run-job.component.html",
  styleUrls: ["./run-job.component.scss"]
})
export class RunJobComponent implements OnInit {
  jobs: Observable<Job[]>;
  loading: boolean = true;
  sortOrder: number;
  sortField: string;
  sortOptions: SelectItem[];
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
    this.jobs = this.dbService.getObjectList("jobs");
    this.loading = false;
  }

  jobDetails(_id: string){
    this.router.navigate(['jobs/history', _id]);
  }
  runJob(_id: string){
    this.router.navigate(['jobs/run', _id]);
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