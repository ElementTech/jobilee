import { DBService } from '../../../services/db.service';
import { Dashboard } from '../../../data/dashboard/dashboard';
import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RunService } from '../../../services/run.service';
@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit {


  @Input() charts: Array<string> = [];
  @Input() dashboard: Dashboard = {'refresh': 60};
  chartsDefinitions:Object = {};
  chartsMetadata:Object = {};
  interval: any;
  refreshing = false;
  constructor(private dbService: DBService,
    private router: Router, private runService: RunService) {

    }

  ngOnInit() {
    this.refresh()
    this.interval = setInterval(() => {
      console.log("counting until refresh",this.dashboard?.refresh)
      this.refresh(); // api call
  }, (this.dashboard?.refresh)*1000);

  }
  onIntervalChange(event){
    if (this.interval) {
      clearInterval(this.interval);
    }
    console.log("changed",event.value)
    this.interval = setInterval(() => {
      console.log("counting until refresh",this.dashboard?.refresh)
      this.refresh(); // api call
  }, (event.value)*1000);
}
  ngOnDestroy() {
    clearInterval(this.interval);
 }
  promiseQueue: any = {}
  refresh()
  {
    this.promiseQueue = {}
    Object.keys(this.chartsDefinitions).forEach(element => {
      this.promiseQueue[element] = this.templateToDefinition(element)
      Promise.all(Object.values(this.promiseQueue)).then(done=>{
        for (const [key, value] of Object.entries(this.promiseQueue)) {
          this.chartsDefinitions[key] = value
        }
      })
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.charts.currentValue == undefined)
    {
      changes.charts.currentValue = []
    }

    this.chartsMetadata = changes.charts.currentValue
    .filter(key => !Object.keys(this.chartsMetadata).includes(key))
    .reduce((acc, key) => ({...acc, [key]: this.dbService.getObjectListByKey('charts','name',key)}), this.chartsMetadata);

    this.chartsDefinitions = changes.charts.currentValue
    .filter(key => !Object.keys(this.chartsDefinitions).includes(key))
    .reduce((acc, key) => ({...acc, [key]: {}}), this.chartsDefinitions);
  }    

  async templateToDefinition(chart) {

    return new Promise(async (resolve, reject) => {
      await this.runService.renderExistingChart(chart).subscribe(async (result)=>{
          let response;
          while ((response == undefined) || !("result" in response)) {
            response = await this.dbService.getObject("chart_tasks", result["task_id"]).toPromise();
            await new Promise(resolve => setTimeout(resolve, 1000));

          }
          let options: any = []
    
          if (response['result']){
            resolve(response['outputs'])
          } else {
            resolve(null)
          }
        })
    })

  }
}


