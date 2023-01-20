import { JobDetailsComponent } from '../job-details/job-details.component';
import { Observable } from "rxjs";
import { DBService } from "src/app/db.service";
import { Job } from "src/app/job";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
@Component({
  selector: "app-job-history",
  templateUrl: "./job-history.component.html",
  styleUrls: ["./job-history.component.css"]
})
export class JobHistoryComponent implements OnInit {
  jobs: Observable<Job[]>;
  loading: boolean = true;
  _id: any;
  tasks: Observable<any>;
  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { 

    }

  ngOnInit() {
    this._id = this.route.snapshot.params['_id'];
    this.reloadData()
  }
  getBackground(task)
  { 
    if (task.hasOwnProperty('result')) {
      if (task['result'])
      {
        return 'bg-green-200'
      } else {
        return 'bg-red-200'
      }
    } else {
      return 'bg-blue-200'
    }
  }
  getIcon(task)
  { 
    if (task.hasOwnProperty('result')) {
      if (task['result'])
      {
        return 'pi pi-check green'
      } else {
        return 'pi pi-times'
      }
    } else {
      return 'pi pi-question'
    }
  }
  reloadData()
  {
    this.tasks = this.dbService.getObjectListByKey("tasks","job_id",this._id)
    this.tasks.subscribe(data=>{
      console.log(data)
    })
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
        this.dbService.deleteObject("tasks",_id)
        .subscribe(
          data => {
            Swal.fire(
              'Deleted!',
              'Job Run has been deleted.',
              'success'
            )
            this.reloadData();
          },
          error => console.log(error));
      }
    })

  }

}