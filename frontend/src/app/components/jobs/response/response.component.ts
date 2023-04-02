import { DBService } from "src/app/shared/services/db.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Observable, switchMap, takeWhile, timer } from "rxjs";
import { NgxMonacoEditorConfig } from "ngx-monaco-editor-v2";

@Component({
  selector: 'app-job-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss']
})
export class JobResponseComponent implements OnInit {
  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  task: Observable<any>;
  _id: any;
  step: any;
  task_id: any;
  job: Observable<any>;
  attribute: any;
  code: any
  constructor(private dbService: DBService,private route: ActivatedRoute) {

    }
  retryer: any;

  ngOnInit() {
    
    this._id = this.route.snapshot.params['_id'];
    this.task_id = this.route.snapshot.params['task_id'];
    this.step = this.route.snapshot.params['step'];
    this.attribute = this.route.snapshot.params['attribute'];
    this.job = this.dbService.getObject("jobs",this._id);
    this.dbService.getObject("tasks",this.task_id).subscribe(data=>{
      this.code = data['steps'][this.step][this.attribute]
      this.retryer = timer(0, 1000).pipe(                        // <-- poll every 5 seconds
      switchMap(() => 
        this.dbService.getObject("tasks",this.task_id,true)   // <-- first emission from `timer` is 0
      ),
      takeWhile(                                // <-- stop polling when a condition from the response is unmet
        (response: any) => {this.code = response['steps'][this.step][this.attribute];return (!(response['steps'][this.step]['result'] != 0))},
        true                                    // <-- emit the response that failed the test
      ),
      filter((response: any) => 
        ('result' in response)   // <-- forward only emissions that pass the condition
      )
    ).subscribe();
    });

  }
  ngOnDestroy()
  {
    this.retryer.unsubscribe();
  }

}

