import { DBService } from 'src/app/db.service';
import { Job } from 'src/app/job';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
import { Integration } from 'src/app/integration';
import { getStringAfterSubstring, getStringBeforeSubstring } from 'src/main';
import { RunService } from 'src/app/run.service';
import { filter, switchMap, takeWhile } from 'rxjs/operators';
import { defer, from, timer } from 'rxjs';
@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  public initialData: any;
  integrations: any;
  @Input() _id: string;
  @Input() formType: "Create" | "Update";
  @Input() job: Job
  submitted = false;
  dynamicResults = {}

  constructor(private dbService: DBService,
    private router: Router, private runService: RunService) {
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';
    }

  ngOnInit() {
    for (const param of this.job?.parameters)
    {
      if (param.type == "dynamic")
      {
        this.dynamicResults[param.name] = []
      }
    }
    this.dbService.getObjectList("integrations").subscribe(data=>{
      this.integrations = data
    })
  }

  getURL(integrationName) {
      return this.integrations?.find(item => item.name === integrationName)?.url
  }
  getSuffix(integrationName) {
    return getStringAfterSubstring(this.integrations?.find(item => item.name === integrationName)?.steps[0].definition,"{job}")
  }
  getPrefix(integrationName) {
    return getStringBeforeSubstring(this.integrations?.find(item => item.name === integrationName)?.steps[0].definition,"{job}")
  }

  alreadyTriggered = {}
  // this.retryer.unsubscribe();
  async getOptions(paramDefinition) {
    const jobDefinition = paramDefinition['job']

    const prom = new Promise<Array<any>>(async (resolve) => {
      if (!(jobDefinition['id'] in this.alreadyTriggered)) {
        this.alreadyTriggered[jobDefinition['id']] = true;
        try {
            const result = await this.runService.runJob(jobDefinition['id'], jobDefinition['parameters']).toPromise();
            let response;
            while (!response || !('result' in response)) {
                response = await this.dbService.getObject("tasks", result["task_id"]).toPromise();
                if (!('result' in response)) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            let options: any = []
            if (response['result']){
                for (const item of jobDefinition['from']) {
                  console.log(item)
                  for (const stepResult of response['steps'])
                  {
                    console.log(stepResult)
                    if (stepResult['step'] == item['step']) {
                        for (const [stepKey, stepValue] of Object.entries(stepResult['outputs']))
                        {
                          console.log(stepKey, stepValue)
                          if (item['outputs'].includes(stepKey))
                          {
                            options.push(stepValue)
                          }
                        }
                    }
                  }
                }
            }
            if (options.length == 0) {
              resolve(jobDefinition['default'].split(","))
            }
            resolve(options)
        } catch (error) {
            console.log(JSON.stringify(error.message));
            resolve(jobDefinition['default'].split(","))
        }
    }
    });
    prom.then(data=>{
      console.log(data)
      return data
    })
    return prom
  }


  save() {
    if (this.formType == "Create")
    {
      this.dbService
      .createObject("jobs",this.job).subscribe(data => {
        this.job = new Job();
        this.gotoList();
      }, 
      error => console.log(error));
    } else if (this.formType == "Update")
    {
      this.dbService.updateObject("jobs",this._id, this.job)
      .subscribe(data => {
        console.log(data);
        this.job = new Job();
        this.gotoList();
      }, error => console.log(error));
    }
  }

  onSubmit() {
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/jobs']);
  }
}

