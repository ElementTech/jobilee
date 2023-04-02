import { Observable } from "rxjs";
import { DBService } from "src/app/shared/services/db.service";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "app-manage-charts",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.css"]
})
export class ChartListComponent implements OnInit {
  public pageSize = 10;

  // @ViewChild('name', {static : true}) nameTemplate : TemplateRef<any>;
  @ViewChild('actions', {static : true}) actionsTemplate : TemplateRef<any>;
  
  customTemplates = {

  }

  templateContext = {
  }

  data: Observable<any>;
  charts: any;

  constructor(public dbService: DBService,
    private router: Router) {
  }

  ngOnInit(){

    this.dbService.getObjectList('charts').subscribe(data=>{
      this.data = data;
    })  
    this.customTemplates = {    
      'actions': this.actionsTemplate
    }
  }



}