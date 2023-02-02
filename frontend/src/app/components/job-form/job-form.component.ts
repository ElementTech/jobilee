import { DBService } from 'src/app/db.service';
import { Job } from 'src/app/job';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
import { Integration } from 'src/app/integration';
import { getStringAfterSubstring, getStringBeforeSubstring, toSelectItem } from 'src/main';
import { RunService } from 'src/app/run.service';
import { filter, switchMap, takeWhile } from 'rxjs/operators';
import { defer, from, timer } from 'rxjs';
import { SelectItem } from 'primeng/api';
@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  public initialData: any;
  toSelectItem = toSelectItem;
  integrations: any;
  @Input() _id: string;
  @Input() formType: "Create" | "Update";
  @Input() job: Job
  submitted = false;
  dynamicResults = {}
  dynamicResultsError = {}
  examples =[
    {
      "name": "string-param",
      "type": "text",
      "default": "mytext"
    },
    {
      "name": "number-param",
      "type": "number",
      "default": 0
    },
    {
      "name": "choice-param",
      "type": "choice",
      "default": "b",
      "choices": ["a","b","c","d"]
    },
    {
      "name": "multi-choice-param",
      "type": "multi-choice",
      "default": "f,h",
      "choices": ["e","f","g","h"]
    },
    {
      "name": "dynamic-param",
      "type": "dynamic",
      "default": "a,b",
      "job": {
        "id": "Random Users",
        "parameters": {
          "size": "2"
        },          
        "from": [{
          "step": 0,
          "outputs": ["first_name","last_name"],
        }]
      }
    }
  ]
  steps: any;

  constructor(private dbService: DBService,
    private router: Router, private runService: RunService) {
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';
    }

  async ngOnInit() {

    this.dbService.getObjectList("integrations").subscribe(data=>{
      this.integrations = data
      this.regenerateParams()
    })
  }
  getSteps()
  {
    return this.integrations?.find(item => item.name === this.job.integration)?.steps.map((item)=>item.name)
  }

  regenerateParams()
  {
    this.dynamicResultsError = []
    if (this.job?.parameters != undefined)
    {
      for (const param of this.job?.parameters)
      {
        if (param.type == "dynamic")
        {
          this.dynamicResults[param.name] = []
          this.generateDynamicParams(param)
  
        }
      }
    }
  }
  flatten(items) {
    const flat = [];
  
    items.forEach(item => {
      if (Array.isArray(item)) {
        flat.push(...this.flatten(item));
      } else {
        flat.push(item);
      }
    });
  
    return flat;
  }

  async generateDynamicParams(param) {
    try {
        let result = await this.runService.runJob(param['job']['id'], param['job']['parameters']).toPromise();
        let response;
        await new Promise(resolve => setTimeout(resolve, 1000));
        while ((response == undefined) || !('result' in response)) {
          try {
            response = await this.dbService.getObject("tasks", result["task_id"]).toPromise();
            if ((response == undefined) || !('result' in response)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } catch {
            response = await this.dbService.getObject("tasks", result["task_id"]).toPromise();
          }
        }
        let options: any = []

        if (response['result']){
          
            for (const item of param['job']['from']) {
              for (const stepResult of response['steps'])
              {
                if (stepResult['name'] == item['step']) {
                    for (const [stepKey, stepValue] of Object.entries(stepResult['outputs']))
                    {
                      if (item['outputs'].includes(stepKey))
                      {
                        options = options.concat(stepValue)
                      }
                    }
                }
              }
            }
        }

        if(Object.prototype.toString.call(param.default) === '[object Array]') {
          param.default = this.flatten(param.default)
        } else {
          param.default = param.default.split(",")
        }
        if (options.length == 0) {
          this.dynamicResultsError[param.name] = "No Results"
          this.dynamicResults[param.name] = param.default[0]
        }


        if (!options.includes(param.default))
        {
          options.push(param.default[0])
        }
        this.dynamicResults[param.name] = options
    } catch (error) {
        console.log(JSON.stringify(error.message));
        this.dynamicResultsError[param.name] = error.message
        this.dynamicResults[param.name] = param.default
    }
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

