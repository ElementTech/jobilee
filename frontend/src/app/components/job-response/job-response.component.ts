import { DBService } from 'src/app/db.service';
import { Job } from 'src/app/job';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
import { Integration } from 'src/app/integration';
import { getStringAfterSubstring, getStringBeforeSubstring, toSelectItem } from 'src/main';
import { RunService } from 'src/app/run.service';
import { filter, switchMap, takeWhile } from 'rxjs/operators';
import { defer, from, Observable, timer } from 'rxjs';
import { SelectItem } from 'primeng/api';
@Component({
  selector: 'app-job-response',
  templateUrl: './job-response.component.html',
  styleUrls: ['./job-response.component.scss']
})
export class JobResponseComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  task: Observable<any>;
  private _id: any;
  step: any;
  task_id: any;
  job: Observable<any>;
  attribute: any;
  constructor(private dbService: DBService,private route: ActivatedRoute) {
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'tree';
    }
  retryer: any;
  ngOnInit() {
    this._id = this.route.snapshot.params['_id'];
    this.task_id = this.route.snapshot.params['task_id'];
    this.step = this.route.snapshot.params['step'];
    this.attribute = this.route.snapshot.params['attribute'];
    this.job = this.dbService.getObject("jobs",this._id);
    this.dbService.getObject("tasks",this.task_id).subscribe(data=>{
      this.task = data
      this.retryer = timer(0, 1000).pipe(                        // <-- poll every 5 seconds
      switchMap(() => 
        this.dbService.getObject("tasks",this.task_id)   // <-- first emission from `timer` is 0
      ),
      takeWhile(                                // <-- stop polling when a condition from the response is unmet
        (response: any) => {this.task = response;return (!(response['steps'][this.step]['result'] != 0))},
        true                                    // <-- emit the response that failed the test
      ),
      filter((response: any) => 
        ('result' in response)   // <-- forward only emissions that pass the condition
      )
    ).subscribe();
    });

  }
  makeOptions = () => {
    let editorOptions = new JsonEditorOptions()
    editorOptions.modes = ['code', 'tree'];
    editorOptions.mode = 'tree';
    return editorOptions
  }
}

