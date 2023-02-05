import { DBService } from 'src/app/db.service';
import { Dashboard } from 'src/app/dashboard';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
import { Integration } from 'src/app/integration';
import { getStringAfterSubstring, getStringBeforeSubstring, toSelectItem } from 'src/main';
import { RunService } from 'src/app/run.service';
import { filter, switchMap, takeWhile } from 'rxjs/operators';
import { defer, from, timer } from 'rxjs';
import { SelectItem } from 'primeng/api';
@Component({
  selector: 'app-dashboard-form',
  templateUrl: './dashboard-form.component.html',
  styleUrls: ['./dashboard-form.component.scss']
})
export class DashboardFormComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  toSelectItem = toSelectItem;
  @Input() _id: string;
  @Input() formType: "Create" | "Update";
  @Input() dashboard: Dashboard
  submitted = false;
  charts: any;
display: any = false;

  constructor(private dbService: DBService,
    private router: Router, private runService: RunService) {
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';
    }

  ngOnInit() {

    this.charts = this.dbService.getObjectList("charts");
  }

  reRenderCharts(){
    this.dashboard.charts = [...this.dashboard.charts]
  }

  save() {
    if (this.formType == "Create")
    {
      this.dbService
      .createObject("dashboards",this.dashboard).subscribe(data => {
        this.dashboard = new Dashboard();
        this.gotoList();
      }, 
      error => console.log(error));
    } else if (this.formType == "Update")
    {
      this.dbService.updateObject("dashboards",this._id, this.dashboard)
      .subscribe(data => {
        this.dashboard = new Dashboard();
        this.gotoList();
      }, error => console.log(error));
    }
  }

  onSubmit() {
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/dashboards']);
  }
}

