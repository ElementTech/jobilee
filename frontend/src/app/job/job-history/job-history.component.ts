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
  tasks: any;
  statuses = [
    {label: 'Success', value: true},
    {label: 'Failure', value: false},
  ]
  interval: any;
  job: Observable<any>;
  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { 

    }
  ngOnDestroy() {
      if (this.interval) {
        clearInterval(this.interval);
      }
   }

   toHoursMinutesSeconds = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let result = `${minutes
      .toString()
      .padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (!!hours) {
      result = `${hours.toString()}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return result;
  };
  ngOnInit() {
    this._id = this.route.snapshot.params['_id'];
    this.job = this.dbService.getObject("jobs",this._id)
    this.reloadData(); // api call
    this.interval = setInterval(() => {
        this.reloadData(); // api call
    }, 3000);
  }
  getBackground(task)
  { 

    if (task.hasOwnProperty('done')) {
      if (task['done']) {
        if (task.hasOwnProperty('result')) {
          if (task['result'])
          {
            return 'bg-green-200'
          } else {
            if (task['steps'].map(item=>item.result).includes(3))
            {
              return 'bg-yellow-200'
            }
            else 
            {
              return 'bg-red-200'
            }        
          }
        } else {
          return 'bg-blue-200'
        }
      } else {
        return 'bg-blue-200'
      }

    } else {
      return 'bg-blue-200'
    }


  }
  getIcon(task)
  { 
    if (task.hasOwnProperty('done')) {
      if (task['done']) {
        if (task.hasOwnProperty('result')) {
          if (task['result'])
          {
            return 'pi pi-check green'
          } else {
            if (task['steps'].map(item=>item.result).includes(3))
            {
              return 'pi pi-minus'
            }
            else 
            {
              return 'pi pi-times'
            }        
          }
        } else {
          return 'pi pi-question'
        }
      } else {
        return 'pi pi-question'
      }

    } else {
      return 'pi pi-question'
    }
  }
  reloadData()
  {
    this.dbService.getObjectListByKey("tasks","job_id",this._id).subscribe(data=>{
      this.tasks = data
      this.loading = false
    })
  }
  clearHistory()
  {
    Swal.fire({
      title: 'Are you sure you want to clear the entire history?',
      // text: "This will break jobs that depend on this job.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbService.deleteObjects("tasks","job_id",this._id)
        .subscribe(
          data => {
            Swal.fire(
              'Deleted!',
              'Job history has been cleared.',
              'success'
            )
            this.reloadData();
          },
          error => console.log(error));
      }
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