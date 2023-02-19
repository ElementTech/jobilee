import { from, Observable, timer } from "rxjs";
import { DBService } from "src/app/db.service";
import { Job } from "src/app/job";
import { Component, HostBinding, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { RunService } from "src/app/run.service";
import { delay, filter, flatMap, map, mergeMap, retry, switchMap, takeLast, takeWhile } from "rxjs/operators";
import {PrimeIcons} from 'primeng/api';
@Component({
  selector: "app-job-output",
  templateUrl: "./job-output.component.html",
  styleUrls: ["./job-output.component.scss"],
})
export class JobOutputComponent implements OnInit {

  _id: string;
  job: Observable<any>;
  task: any;
  task_id: any;
  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService, private runService: RunService) { 

    }

  ngOnInit() {

    this._id = this.route.snapshot.params['_id'];
    this.task_id = this.route.snapshot.params['task'];
    this.job = this.dbService.getObject("jobs",this._id)
    this.task = this.dbService.getObject("tasks",this.task_id)


  }
  
}