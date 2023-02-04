import { Chart } from 'src/app/chart';
import { Component } from '@angular/core';
@Component({
  selector: 'app-create-chart',
  templateUrl: './create-chart.component.html',
  styleUrls: ['./create-chart.component.css']
})
export class CreateChartComponent {


  chart: Chart = {
    name: "",
    label: "",
    jobs: [],
    definitionTemplate: [{
      output: "",
      type: "",
      condition: "",
      value: ""
    }]
  };
  
}