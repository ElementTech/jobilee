import { Component, OnInit } from '@angular/core';
import { Dashboard } from 'src/app/dashboard';
import { ActivatedRoute, Router } from '@angular/router';
import { DBService } from 'src/app/db.service';
import {JsonEditorOptions} from "@maaxgr/ang-jsoneditor"

@Component({
  selector: 'app-update-dashboard',
  templateUrl: './update-dashboard.component.html',
  styleUrls: ['./update-dashboard.component.css']
})
export class UpdateDashboardComponent implements OnInit {

  _id: string;
  dashboard: Dashboard;

  constructor(private route: ActivatedRoute,private router: Router,
    private dbService: DBService) { 
    }

  ngOnInit() {
    this.dashboard = new Dashboard();

    this._id = this.route.snapshot.params['_id'];
    
    this.dbService.getObject("dashboards",this._id)
      .subscribe(data => {
        this.dashboard = data;
      }, error => console.log(error));
  }

}