import { Observable } from "rxjs";
import { DBService } from "src/app/shared/services/db.service";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "app-manage-integrations",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.css"]
})
export class IntegrationListComponent implements OnInit {
  public selected = [];
  public tableItem$: Observable<any[]>;
  public searchText;
  public pageSize = 10;
  total$: Observable<number>;

  @ViewChild('name', {static : true}) nameTemplate : TemplateRef<any>;
  @ViewChild('steps', {static : true}) stepsTemplate : TemplateRef<any>;
  @ViewChild('actions', {static : true}) actionsTemplate : TemplateRef<any>;
  customTemplates = {

  }

  templateContext = {
  }

  data: any;
  integrations: any;

  constructor(public dbService: DBService,
    private router: Router) {
  }

  ngOnInit(){

    this.dbService.getObjectList('integrations').subscribe(data=>{
      this.data = data;
    })        
    this.customTemplates = {    
      'name': this.nameTemplate,
      'steps': this.stepsTemplate,
      'actions': this.actionsTemplate
    }
  }



}