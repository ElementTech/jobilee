import { Observable } from "rxjs";
import { DBService } from "src/app/db.service";
import { Job } from "src/app/job";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { SelectItem } from 'primeng/api';
import { JsonEditorOptions } from "@maaxgr/ang-jsoneditor";
import { RunService } from "src/app/run.service";
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
  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService, private runService: RunService) { 
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';
    }

  ngOnInit() {

    this._id = this.route.snapshot.params['_id'];
    this.task_id = this.route.snapshot.params['task'];
    this.job = this.dbService.getObject("jobs",this._id)
    console.log(this.task_id)
    this.dbService.getObject("tasks",this.task_id)
      .subscribe(data => {
        this.task = data;
        this.integrationSteps = this.dbService.getObject("integrations",data['integration_id'])

        console.log(this.task)
      }, error => console.log(error));
  }

  list(){
    this.router.navigate(['jobs']);
  }
  deleteJob(_id: string) {
    
    Swal.fire({
      title: 'Are you sure?',
      // text: "This will break jobs that depend on this job.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbService.deleteObject("jobs",_id)
        .subscribe(
          data => {
            Swal.fire(
              'Deleted!',
              'Job has been deleted.',
              'success'
            )
            this.router.navigate(['jobs']);
          },
          error => console.log(error));
      }
    })

  }
  result: any;

  
}