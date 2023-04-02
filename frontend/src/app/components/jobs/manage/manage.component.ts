import { Observable } from "rxjs";
import { DBService } from "src/app/shared/services/db.service";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import Swal from "sweetalert2";
@Component({
  selector: "app-manage-jobs",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.css"]
})
export class JobListComponent implements OnInit {
  public pageSize = 10;

  @ViewChild('name', {static : true}) nameTemplate : TemplateRef<any>;
  @ViewChild('history', {static : true}) historyTemplate : TemplateRef<any>;
  @ViewChild('parameters', {static : true}) parametersTemplate : TemplateRef<any>;
  @ViewChild('steps', {static : true}) stepsTemplate : TemplateRef<any>;
  @ViewChild('actions', {static : true}) actionsTemplate : TemplateRef<any>;

  customTemplates = {

  }

  templateContext = {
    failedJobs: (history) => {
      return history?.filter(run=>!run.result)?.length
    },
    isHealthy: (history) => {
      if (Array.isArray(history))
      {
        if (history.length > 0)
        {
          switch (history?.every(run=>run.result)) {
            case true:
              return ["success",0]
            case false:
              switch (history?.every(run=>!run.result)) {
                case true:
                  return ['danger',this.templateContext.failedJobs(history)]
                case false:
                  return ['warning',this.templateContext.failedJobs(history)]
              }        
            default:
              return ["unknown",0]
          }
        } else {
          return ["unknown",0]
        }
      } else {
        return ["unknown",0]
      }

    },
    deleteItem: this.deleteItem,
    getIntegrationIcon: (icon,text) => {return icon || `https://www.vectorlogo.zone/logos/${text.split(" ")[0].toLowerCase()}/${text.split(" ")[0].toLowerCase()}-icon.svg`}
  }

  data: any;
  integrations: any = {};

  constructor(public dbService: DBService,
    private router: Router) {
  }

  ngOnInit(){
    this.initTable()

  }

  initTable()
  {
    this.dbService.getJobsCatalog().subscribe(data=>{
      this.data = data;
    })    
    this.dbService.getObjectList("integrations").subscribe(data=>{
        data.forEach(element => {
        this.integrations[element.name] = element.icon
      });
      this.customTemplates = {    
        'name': this.nameTemplate,
        'history': this.historyTemplate,
        'parameters': this.parametersTemplate,
        'steps': this.stepsTemplate,
        'actions': this.actionsTemplate
      }
    });
  }

  deleteItem(element) {
    console.log(element)
    Swal.fire({
      title: `Are you sure you want to delete job ${element.name}?`,
      // text: element.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbService.deleteObject(`jobs`,element._id)
        .subscribe(
          data => {
            Swal.fire(
              'Deleted!',
              `job ${element.name} has been deleted.`,
              'success'
            )
            this.initTable()
          },
          error => console.log(error));
      }
    })


  }
}