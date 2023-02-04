import { DBService } from 'src/app/db.service';
import { Chart } from 'src/app/chart';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {JsonEditorComponent, JsonEditorOptions} from "@maaxgr/ang-jsoneditor"
import { Integration } from 'src/app/integration';
import { getStringAfterSubstring, getStringBeforeSubstring, toSelectItem } from 'src/main';
import { RunService } from 'src/app/run.service';
import { filter, switchMap, takeWhile } from 'rxjs/operators';
import { defer, from, Observable, timer } from 'rxjs';
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-chart-form',
  templateUrl: './chart-form.component.html',
  styleUrls: ['./chart-form.component.scss']
})

export class ChartFormComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  public initialData: any;
  toSelectItem = toSelectItem;
  definitionTemplate: any;
  integrations: any;
  @Input() _id: string;
  @Input() formType: "Create" | "Update";
  @Input() chart: Chart
  submitted = false;
  placeholders: Observable<any>;
  types = [
    {name: 'bar', icon: 'fa-solid fa-chart-column'},
    {name: 'doughnut', icon: 'fa-solid fa-circle-dot'},
    {name: 'line', icon: 'fa-solid fa-chart-line'},
    {name: 'pie', icon: 'fa-solid fa-chart-pie'},
    {name: 'table', icon: 'fa-solid fa-table'}
  ];
  jobs: Observable<any>;
  outputs: Observable<any>;


  circularReplacer = () => {

    // Creating new WeakSet to keep 
    // track of previously seen objects
    const seen = new WeakSet();
    
    return (key, value) => {
        // If type of value is an 
        // object or value is null
        if (typeof(value) === "object" 
            && value !== null) {
        
        // If it has been seen before
        if (seen.has(value)) {
                 return;
             }
             
             // Add current value to the set
             seen.add(value);
       }
       
       // return the value
       return value;
   };
};
  

  calculatePlaceholders() {
    this.placeholders = this.dbService.calculateJobOutputs(JSON.parse(JSON.stringify(this.chart.jobs, this.circularReplacer())).filter(n => n))
  }
  constructor(private dbService: DBService,
    private router: Router, private runService: RunService) {
      this.editorOptions = new JsonEditorOptions()
      this.editorOptions.modes = ['code', 'tree'];
      this.editorOptions.mode = 'code';
    }
    copyMessage(val: string){
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      Swal.fire({
        icon: 'info',
        backdrop: false,
        text:val,
        title: 'Copied to clipboard',
        position: 'top-right',
        showConfirmButton: false,
        timer: 1000
      })
    }
  async ngOnInit() {
    this.outputs = this.dbService.getJobOutputs()
    this.jobs = this.dbService.getObjectList("jobs")
    if (!this.chart.type)
    {
      this.chart.type = 'bar'
      this.definitionTemplate = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: '#42A5F5',
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                backgroundColor: '#FFA726',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
      }
      this.chart.definition = this.definitionTemplate

    }
  }
  templateToDefinition()
  {
    console.log("rendering")
    this.chart.definition = this.definitionTemplate
  }
  setDefinition()
  {
    switch (this.chart.type) {
      case "table":
        this.definitionTemplate = {
          headers: ['subjectCode', 'subjectTitle', 'subjectGroup', 'status'],
          items: [
            {
              "subjectCode": "1111",
              "subjectTitle": "English Literature",
              "subjectGroup": "English",
              "status": "Available"
            },
            {
              "subjectCode": "2222",
              "subjectTitle": "Algebra III",
              "subjectGroup": "Mathematics",
              "status": "Not Available"
            }
          ]
        }      
        break;
      case "bar":
        this.definitionTemplate = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'My First dataset',
                  backgroundColor: '#42A5F5',
                  data: [65, 59, 80, 81, 56, 55, 40]
              },
              {
                  label: 'My Second dataset',
                  backgroundColor: '#FFA726',
                  data: [28, 48, 40, 19, 86, 27, 90]
              }
          ]
        }
        break;
      case "doughnut":
        this.definitionTemplate = {
          labels: ['A','B','C'],
          datasets: [
              {
                  data: [300, 50, 100],
                  backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ],
                  hoverBackgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ]
              }
          ]
      }
        break;
      case "line":
        this.definitionTemplate = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'First Dataset',
                  data: [65, 59, 80, 81, 56, 55, 40],
                  fill: false,
                  borderColor: '#42A5F5',
                  tension: .4
              },
              {
                  label: 'Second Dataset',
                  data: [28, 48, 40, 19, 86, 27, 90],
                  fill: false,
                  borderColor: '#FFA726',
                  tension: .4
              }
          ]
      }
        break;
      case "pie":
        this.definitionTemplate = {
          labels: ['A','B','C'],
          datasets: [
              {
                  data: [300, 50, 100],
                  backgroundColor: [
                      "#42A5F5",
                      "#66BB6A",
                      "#FFA726"
                  ],
                  hoverBackgroundColor: [
                      "#64B5F6",
                      "#81C784",
                      "#FFB74D"
                  ]
              }
          ]
      }
        break;
      default:
        break;
    }
    this.chart.definition = this.definitionTemplate
  }
  getChartIcon()
  {
    return this.types.find(item=>item.name==this.chart.type).icon
  }
  save() {
    if (this.formType == "Create")
    {
      this.dbService
      .createObject("charts",this.chart).subscribe(data => {
        this.chart = new Chart();
        this.gotoList();
      }, 
      error => console.log(error));
    } else if (this.formType == "Update")
    {
      this.dbService.updateObject("charts",this._id, this.chart)
      .subscribe(data => {
        this.chart = new Chart();
        this.gotoList();
      }, error => console.log(error));
    }
  }

  onSubmit() {
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/charts']);
  }
}

