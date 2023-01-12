import { DBService } from 'src/app/db.service';
import { Job } from 'src/app/job';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  public initialData: any;

  job: Job = {
    type: 'post',
    payload: {"parameter": [{"name": "{key}", "value": "{value}"}]}
  };
  submitted = false;
  optionsURL = [
    {
      name: "{token}",
      description: "An optional hidden Token to be Inserted as an Authentication method to the query"
    }
  ]
  options = [
    {
      name: "{job}",
      description: "The Name/ID of the job that will be triggered through the query"
    },
    { 
      name: "{key}",
      description: "Parameter keys"
    },
    {
      name: "{value}",
      description: "Parameter values"
    }
  ]

  constructor(private dbService: DBService,
    private router: Router) {
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';
  

     }

  ngOnInit() {
  }
  @ViewChild(JsonEditorComponent, { static: false }) editor!: JsonEditorComponent;
  showJson(d: Event) {
    console.log(d)
    this.job.payload = d;
  }

  save() {
    this.dbService
    .createObject("jobs",this.job).subscribe(data => {
      this.job = new Job();
      this.gotoList();
    }, 
    error => console.log(error));
  }

  onSubmit() {
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/jobs']);
  }
}