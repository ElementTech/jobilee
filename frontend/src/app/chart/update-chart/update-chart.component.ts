import { Component, OnInit } from '@angular/core';
import { Chart } from 'src/app/chart';
import { ActivatedRoute, Router } from '@angular/router';
import { DBService } from 'src/app/db.service';
import {JsonEditorOptions} from "@maaxgr/ang-jsoneditor"

@Component({
  selector: 'app-update-chart',
  templateUrl: './update-chart.component.html',
  styleUrls: ['./update-chart.component.css']
})
export class UpdateChartComponent implements OnInit {

  _id: string;
  chart: any;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { 

    }

  ngOnInit() {

      this._id = this.route.snapshot.params['_id'];
      
      this.chart = this.dbService.getObject("charts",this._id)
  }

}