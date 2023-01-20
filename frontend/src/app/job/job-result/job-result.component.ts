import { from, Observable, timer } from "rxjs";
import { DBService } from "src/app/db.service";
import { Job } from "src/app/job";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { SelectItem } from 'primeng/api';
import { JsonEditorOptions } from "@maaxgr/ang-jsoneditor";
import { RunService } from "src/app/run.service";
import { delay, filter, flatMap, map, mergeMap, retry, switchMap, takeLast, takeWhile } from "rxjs/operators";
@Component({
  selector: "app-job-result",
  templateUrl: "./job-result.component.html",
  styleUrls: ["./job-result.component.scss"]
})
export class JobResultComponent implements OnInit {

  _id: string;
  job: Observable<any>;
  response: any;
  editorOptions: JsonEditorOptions;
  task: any;
  task_id: any;
  integrationSteps: Observable<any>;
  retryer: any;
  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService, private runService: RunService) { 

    }
    makeOptions = () => {
      let editorOptions = new JsonEditorOptions()
      editorOptions.modes = ['code', 'tree'];
      editorOptions.mode = 'code';
      return editorOptions
    }
  ngOnDestroy()
  {
    this.retryer.unsubscribe();
  }
  ngOnInit() {

    this._id = this.route.snapshot.params['_id'];
    this.task_id = this.route.snapshot.params['task'];
    this.job = this.dbService.getObject("jobs",this._id)

    this.retryer = timer(0, 1000).pipe(                        // <-- poll every 5 seconds
    switchMap(() => 
      this.dbService.getObject("tasks",this.task_id)   // <-- first emission from `timer` is 0
    ),
    takeWhile(                                // <-- stop polling when a condition from the response is unmet
      (response: any) => {this.task = response;console.log(response);return (!('result' in response))},
      true                                    // <-- emit the response that failed the test
    ),
    filter((response: any) => 
      ('result' in response)   // <-- forward only emissions that pass the condition
    )
  ).subscribe();

  }
  progressBarClass(value): string {
    if (value < 70) {
        return 'redBar';
    }

    if (value < 90) {
        return 'yellowBar';
    }

    return 'greenBar';
}
  list(){
    this.router.navigate(['jobs']);
  }

  result: any;

  
}