import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/job';
import { ActivatedRoute, Router } from '@angular/router';
import { DBService } from 'src/app/db.service';
import {JsonEditorOptions} from "@maaxgr/ang-jsoneditor"

@Component({
  selector: 'app-update-job',
  templateUrl: './update-job.component.html',
  styleUrls: ['./update-job.component.css']
})
export class UpdateJobComponent implements OnInit {


  public editorOptions: JsonEditorOptions;
  public initialData: any;

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



  _id: string;
  job: Job;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { 
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';
    }

  ngOnInit() {
    this.job = new Job();

    this._id = this.route.snapshot.params['_id'];
    
    this.dbService.getObject("jobs",this._id)
      .subscribe(data => {
        this.job = data;
      }, error => console.log(error));
  }

  updateJob() {
    this.dbService.updateObject("jobs",this._id, this.job)
      .subscribe(data => {
        console.log(data);
        this.job = new Job();
        this.gotoList();
      }, error => console.log(error));
  }

  onSubmit() {
    this.updateJob();    
  }

  gotoList() {
    this.router.navigate(['/jobs']);
  }
}