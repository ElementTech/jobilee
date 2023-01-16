import { DBService } from 'src/app/db.service';
import { Job } from 'src/app/job';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
import { Integration } from 'src/app/integration';
import { getStringAfterSubstring, getStringBeforeSubstring } from 'src/main';
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
  @Input() job: Job = {
    parameters: [
      {
        "name": "string-param",
        "type": "text",
        "default": "mytext"
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
      }
  ]
  };
  submitted = false;


  constructor(private dbService: DBService,
    private router: Router) {
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';

     }

  ngOnInit() {
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

