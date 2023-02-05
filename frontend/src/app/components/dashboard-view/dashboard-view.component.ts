import { DBService } from 'src/app/db.service';
import { Dashboard } from 'src/app/dashboard';
import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RunService } from 'src/app/run.service';
@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit {


  @Input() charts: Array<string> = [];
  @Input() dashboard: Dashboard;
  chartsDefinitions:Object = {};
  chartsMetadata:Object = {};

  constructor(private dbService: DBService,
    private router: Router, private runService: RunService) {

    }

  ngOnInit() {


  }
  refresh()
  {
    Object.keys(this.chartsDefinitions).forEach(element => {
      this.chartsDefinitions[element] = this.templateToDefinition(element)
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
    .reduce((acc, key) => ({...acc, [key]: this.templateToDefinition(key)}), this.chartsDefinitions);
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


