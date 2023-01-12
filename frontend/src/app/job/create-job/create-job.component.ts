import { DBService } from 'src/app/db.service';
import { Job } from 'src/app/job';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
import { Integration } from 'src/app/integration';
@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  public initialData: any;
  integrations: any;
  job: Job = {
  };
  submitted = false;


  constructor(private dbService: DBService,
    private router: Router) {


     }

  ngOnInit() {
    this.integrations = this.dbService.getObjectList("integrations");
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