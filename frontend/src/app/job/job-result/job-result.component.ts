import { from, Observable, timer } from "rxjs";
import { DBService } from "src/app/db.service";
import { Job } from "src/app/job";
import { Component, HostBinding, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { SelectItem } from 'primeng/api';
import { JsonEditorOptions } from "@maaxgr/ang-jsoneditor";
import { RunService } from "src/app/run.service";
import { delay, filter, flatMap, map, mergeMap, retry, switchMap, takeLast, takeWhile } from "rxjs/operators";
import {PrimeIcons} from 'primeng/api';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatStepper } from "@angular/material/stepper";
@Component({
  selector: "app-job-result",
  templateUrl: "./job-result.component.html",
  styleUrls: ["./job-result.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false,showError: false},
    },
  ]
})
export class JobResultComponent implements OnInit {

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
  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService, private runService: RunService) { 

    }
    makeOptions = () => {
      let editorOptions = new JsonEditorOptions()
      editorOptions.modes = ['code', 'tree'];
      editorOptions.mode = 'code';
      return editorOptions
    }
  ngOnDestroy()
  {
    this.retryer.unsubscribe();
  }
  shouldIIcon(index)
  {
    return !(this.task?.steps[index].result == 0)
  }  
  shouldISpin(index)
  {
    return (this.task?.steps[index].result == 0)
  }    
  getIcon(index)
  {
    switch (this.task?.steps[index].result) {
      case 0:
        return "pi-spinner"
      case 1:
        return "pi-times"
      case 2:
        return "pi-check"
      case 3:
        return "pi-times-circle"
      default:
        break;
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

    this.retryer = timer(0, 1000).pipe(                        // <-- poll every 5 seconds
    switchMap(() => 
      this.dbService.getObject("tasks",this.task_id)   // <-- first emission from `timer` is 0
    ),
    takeWhile(                                // <-- stop polling when a condition from the response is unmet
      (response: any) => {this.task = response;document.documentElement.style.setProperty('--items', response.steps.length);return (!('result' in response))},
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

  
}