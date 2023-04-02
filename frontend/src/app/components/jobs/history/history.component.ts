import { map, Observable, tap } from "rxjs";
import { DBService } from "src/app/shared/services/db.service";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from "sweetalert2";
@Component({
  selector: "app-history-jobs",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"]
})
export class JobHistoryComponent implements OnInit {
  pageSize = 10;
  @ViewChild('actions', {static : true}) actionsTemplate : TemplateRef<any>;
  @ViewChild('result', {static : true}) statusTemplate : TemplateRef<any>;
  @ViewChild('creation_time', {static : true}) creation_timeTemplate : TemplateRef<any>;
  @ViewChild('run_time', {static : true}) run_timeTemplate : TemplateRef<any>;
  @ViewChild('update_time', {static : true}) update_timeTemplate : TemplateRef<any>;

  customTemplates = {

  }

  templateContext = {
    toHoursMinutesSeconds: (totalSeconds) => {
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
    },
    deleteItem: this.deleteItem,
    getIcon: (task) =>
    { 
      if (task.hasOwnProperty('done')) {
        if (task['done']) {
          if (task.hasOwnProperty('result')) {
            if (task['result'])
            {
              return 'fa fa-check text-success'
            } else {
              if (task['steps'].map(item=>item.result).includes(3))
              {
                return 'fa fa-minus text-warning'
              }
              else 
              {
                return 'fa fa-times text-danger'
              }        
            }
          } else {
            return 'fa fa-question text-info'
          }
        } else {
          return 'fa fa-question text-info'
        }
  
      } else {
        return 'fa fa-question text-info'
      }
    }  
  }

  data: any;
  integrations: any = {};
  private _id: any = "";

  constructor(public dbService: DBService,private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(){

    this.initTable()

  }
  initTable(){
    this._id = this.route.snapshot.params["_id"];
 
    this.dbService.getObjectListByKey("tasks","job_id",this._id).subscribe(data=>{
      this.data = data;
    })
    this.customTemplates = {    
      'actions': this.actionsTemplate,
      'result': this.statusTemplate,
      'update_time': this.update_timeTemplate,
      'run_time': this.run_timeTemplate,
      'creation_time': this.creation_timeTemplate,
      job_id: this._id
    }
  }

  deleteItem(element) {
    Swal.fire({
      title: `Are you sure you want to delete task ${element}?`,
      // text: element.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dbService.deleteObject(`tasks`,element)
        .subscribe(
          data => {
            Swal.fire(
              'Deleted!',
              `task ${element} has been deleted.`,
              'success'
            )
            this.initTable()
          },
          error => console.log(error));
      }
    })


  }

}