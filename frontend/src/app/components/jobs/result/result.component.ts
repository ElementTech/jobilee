import { from, Observable, timer } from "rxjs";
import { DBService } from "src/app/shared/services/db.service";
import { Job } from "src/app/shared/data/job/job";
import { AfterViewChecked, AfterViewInit, Component, HostBinding, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { JsonEditorOptions } from "@maaxgr/ang-jsoneditor";
import { RunService } from "src/app/shared/services/run.service";
import { delay, filter, flatMap, map, mergeMap, retry, switchMap, takeLast, takeWhile } from "rxjs/operators";
import {PrimeIcons} from 'primeng/api';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatStepper } from "@angular/material/stepper";
import * as feather from 'feather-icons';
import { LoadingBarService } from "@ngx-loading-bar/core";


@Component({
  selector: "app-job-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false,showError: false},
    },
  ]
})
export class JobResultComponent implements OnInit, AfterViewChecked {

  @HostBinding("style.--items") items: number = 0;

  display: boolean = false;

  _id: string;
  job: Observable<any>;
  response: any;
  editorOptions: JsonEditorOptions;
  task: any;
  task_id: any;
  integrationSteps: Observable<any>;
  retryer: any;
  stepper: MatStepper;
  events1: any[];
  constructor(private route: ActivatedRoute,private router: Router,private loader: LoadingBarService,
    private dbService: DBService, private runService: RunService) { 
     
    }
    makeOptions = () => {
      let editorOptions = new JsonEditorOptions()
      editorOptions.modes = ['code', 'tree'];
      editorOptions.mode = 'code';
      return editorOptions
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
  ngOnDestroy()
  {
    this.retryer.unsubscribe();
  }
  // shouldIIcon(index)
  // {
  //   return !(this.task?.steps[index].result == 0)
  // }  
  shouldISpin(index)
  {
    return (this.task?.steps[index].result == 0)
  }    
  getIcon(index,type)
  {
    switch (this.task?.steps[index].result) {
      case 0:
        switch (type) {
          case 'icon':
            return "none"
          case 'border':
            return "none"  
        }
      case 1:

        switch (type) {
          case 'icon':
            return "icon-close font-danger"
          case 'border':
            return "2px solid red"  
        }        
      case 2:

        switch (type) {
          case 'icon':
            return "icon-check font-success"
          case 'border':
            return "2px solid green"  
        }        
      case 3:

        switch (type) {
          case 'icon':
            return "icon-alert font-warning"
          case 'border':
            return "2px solid orange"  
        }        
      default:
        switch (type) {
          case 'icon':
            return "icon-help-alt font-info"
          case 'border':
            return "none"  
        }        
    }

  }
  ngOnInit() {
 
    this.events1 = [
      {status: 'Ordered', date: '15/10/2020 10:30', icon: PrimeIcons.SHOPPING_CART, color: '#9C27B0', image: 'game-controller.jpg'},
      {status: 'Processing', date: '15/10/2020 14:00', icon: PrimeIcons.COG, color: '#673AB7'},
      {status: 'Shipped', date: '15/10/2020 16:15', icon: PrimeIcons.ENVELOPE, color: '#FF9800'},
      {status: 'Delivered', date: '16/10/2020 10:00', icon: PrimeIcons.CHECK, color: '#607D8B'}
    ];
    this._id = this.route.snapshot.params['_id'];
    this.task_id = this.route.snapshot.params['task'];
    this.job = this.dbService.getObject("jobs",this._id)

    this.followTask()

  }
  ngAfterViewChecked() {
    feather.replace();
  }
  followTask()
  {
      this.retryer = timer(0, 1000).pipe(                        // <-- poll every 5 seconds
      switchMap(() => 
        this.dbService.getObject("tasks",this.task_id,true)   // <-- first emission from `timer` is 0
      ),
      takeWhile(                                // <-- stop polling when a condition from the response is unmet
        (response: any) => { this.task = response;console.log(response);return (!(response['done']))},
        true                                    // <-- emit the response that failed the test
      ),
      filter((response: any) => 
        ('result' in response)   // <-- forward only emissions that pass the condition
      )
    ).subscribe();
  }
  progressBarClass(value): string {
    if (value < 70) {
        return 'redBar';
    }

    if (value < 90) {
        return 'yellowBar';
    }

    return 'greenBar';
}
  list(){
    this.router.navigate(['jobs']);
  }

  result: any;

  retry(){
      this.runService.retryJob(this.task_id).subscribe(result=>{
        Swal.fire({
          icon: 'success',
          title: 'Job Triggered Succesfully',
          // text: JSON.stringify(result),
          timer: 1000
        }).then(data=>{
          this.followTask()
        })
      },error=>{
        Swal.fire({
          icon: 'error',
          title: 'Job Trigger Failed',
          text: JSON.stringify(error.message),
        })
      })
  }
}